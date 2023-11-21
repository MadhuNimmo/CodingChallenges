import subprocess
from unittest.mock import patch
import sys
import pytest
from ccwc import ccwc

@pytest.mark.parametrize("pars", [
    (['wcTool/test2.txt']),
    (['-cw', 'wcTool/test2.txt']),
    (['-lc', 'wcTool/test2.txt']),
    (['-mc', 'wcTool/test2.txt']),
    (['wcTool/test.txt', 'wcTool/test2.txt']),
    (['-c', 'wcTool/test.txt', 'wcTool/test2.txt']),
    (['-l', 'wcTool/test.txt', 'wcTool/test2.txt']),
    (['-w', 'wcTool/test.txt', 'wcTool/test2.txt'])
])
def test_ccwc(pars):
    with patch('builtins.print') as mock_print:
        # Save the original sys.argv to restore it later
        original_argv = sys.argv

        try:
            # Set sys.argv to simulate command-line arguments
            sys.argv = ['ccwc.py'] + pars 

            # Call your ccwc function
            ccwc()

            # Call the actual wc command
            expected_output = subprocess.check_output(['wc'] + pars, universal_newlines=True)

            # Alternatively, you can capture the printed output and assert against it
            printed_output = '\n'.join(call[0][0] for call in mock_print.call_args_list)

            # Compare the printed output with the output of the actual wc command
            assert printed_output.strip() == expected_output.strip()
        finally:
            # Restore the original sys.argv
            sys.argv = original_argv