import unittest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from services.pipeline_engine import run_pipeline, rollback_deployment
from services.metrics_service import calculate_dora_metrics

class CIPipelinePlatformTests(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_check(self):
        rv = self.app.get('/api/health')
        self.assertEqual(rv.status_code, 200)
        data = rv.get_json()
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['services']['jenkins'], 'CONNECTED')

    def test_full_pipeline_run(self):
        res = run_pipeline(branch='main', injected_failure='NONE')
        self.assertEqual(res['status'], 'SUCCESS')
        self.assertEqual(len(res['stage_results']), 7)

    def test_pipeline_failure_injection(self):
        # Inject failure at Unit Tests stage
        res = run_pipeline(branch='main', injected_failure='unit_tests')
        self.assertEqual(res['status'], 'FAILED')
        # Stage 3 should fail, downstream stages skipped
        self.assertEqual(res['stage_results'][2]['status'], 'FAILED')
        self.assertEqual(res['stage_results'][3]['status'], 'SKIPPED')

    def test_sonarqube_metrics(self):
        rv = self.app.get('/api/sonarqube/metrics')
        self.assertEqual(rv.status_code, 200)
        data = rv.get_json()
        self.assertIn('quality_gate', data)

    def test_tomcat_rollback(self):
        res = rollback_deployment('TEST')
        self.assertIn(res['status'], ['success', 'error'])

    def test_dora_metrics(self):
        res = calculate_dora_metrics()
        self.assertIn('deployment_frequency', res)
        self.assertIn('lead_time_for_changes', res)

if __name__ == '__main__':
    unittest.main()
