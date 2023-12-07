import re
import socket
import logging
import traceback

trace_stack = traceback.extract_stack()
importer_frame = trace_stack[0]
importer_filename = importer_frame.filename

m = re.match('^.+/(.+\.py)$', importer_filename)
log_filename = m.groups()[0]

log_format = '{} {} %(asctime)s %(levelname)s %(message)s'.format(
    socket.gethostname(),
    log_filename
)

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

sh = logging.StreamHandler()
sh.setFormatter(logging.Formatter(log_format))

logger.addHandler(sh)
