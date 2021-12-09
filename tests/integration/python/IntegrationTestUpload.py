import re
import os
import json

import DB
import DBMapping
import dbpool.pool

import POSTData

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    if environ['REQUEST_METHOD'].upper() == 'POST':

        upload_path = '/var/www/upload'

        #try:
        for i in range(0, 1):
            tmp_result = {}
            RawData = POSTData.Environment.getPOSTData(environ)

            splitted = RawData.split(bytes('\r\n', 'utf-8'))

            separator_line = splitted[0]
            separator_end_line = separator_line + bytes('--', 'utf-8')
            separator_line_nrs = []
            separator_data = []

            processing_seperators = []
            processing_metadata = []
            processing_index_end = []
            processing_content_disposition = []

            #tmp_result['seperator'] = separator_line
            #tmp_result['separator_data'] = separator_data

            line_nr = 0
            for line in splitted:
                if line == separator_line or line == separator_end_line:
                    separator_line_nrs.append(line_nr)
                line_nr += 1

            for i in range(0, len(separator_line_nrs)-1):
                line_nr = separator_line_nrs[i]
                processing_seperators.append(line_nr)
                section_type = None
                content_disposition = splitted[line_nr+1].split(bytes(';', 'utf-8'))
                try:
                    content_type = splitted[line_nr+2]
                except Exception as e:
                    content_type = None

                if content_type is not None and len(content_type) == 0:
                    section_type = 'variable'
                    start_add = 3
                else:
                    section_type = 'file'
                    start_add = 4                

                start = line_nr + start_add
                index_end = separator_line_nrs.index(line_nr)+1

                try:
                    m = re.search(b'Content-Disposition: (.+)$', content_disposition[0])
                    content_disposition_type = m.group(1).decode('utf-8')
                except Exception as e:
                    content_disposition_type = None

                try:
                    m_name = re.search(b'name="(.+)"$', content_disposition[1])
                    name = m_name.group(1).decode('utf-8')
                except Exception as e:
                    name = None

                try:
                    m_filename = re.search(b'filename="(.+)"$', content_disposition[2])
                    filename = m_filename.group(1).decode('utf-8')
                except Exception as e:
                    filename = None

                if section_type == 'file':
                    end_substract = 0
                if section_type == 'variable':
                    end_substract = 0

                end = separator_line_nrs[index_end]-end_substract

                meta_data = {}
                meta_data['type'] = section_type
                meta_data['content_type'] = content_type
                meta_data['content_disposition'] = content_disposition_type
                meta_data['position'] = (start, end)
                meta_data['name'] = name
                meta_data['filename'] = filename

                if meta_data['type'] == 'variable' and meta_data['name'] == 'SessionID':
                    session_id = splitted[meta_data['position'][0]].decode('utf-8')
                    tmp_result['session_id'] = str(session_id)

                if meta_data['type'] == 'variable' and meta_data['name'] == 'UserID':
                    for_user_id = splitted[meta_data['position'][0]]
                    tmp_result['for_user_id'] = str(for_user_id)

                separator_data.append(meta_data)
                processing_metadata.append(meta_data)
                processing_index_end.append(index_end)
                processing_content_disposition.append(content_disposition)

            #tmp_result['separator_line_nrs'] = str(separator_line_nrs)
            #tmp_result['processing_seperators'] = str(processing_seperators)
            #tmp_result['processing_index_end'] = str(processing_index_end)
            #tmp_result['processing_content_disposition'] = str(processing_content_disposition)
            #tmp_result['processing_metadata'] = str(processing_metadata)
            #tmp_result['processed'] = 'ok'

            for element in separator_data:
                if element['type'] == 'file' and element['content_type'] == b'Content-Type: application/pdf':
                    tmp_result['file_format_pdf'] = True
                    user_dir = upload_path + '/' + str(user_id)
                    try:
                        os.mkdir(user_dir)
                    except Exception as e:
                        pass
                    write_file = user_dir + '/' + element['filename']
                    with open(write_file, 'wb') as fh:
                        for i in range(element['position'][0], element['position'][1]):
                            if i == element['position'][1]-1:
                                write_bytes = splitted[i]
                            else:
                                write_bytes = splitted[i] + b'\r\n'
                            fh.write(write_bytes)

        #except Exception as e:
        #    tmp_result['error'] = True
        #    tmp_result['exception_id'] = type(e).__name__
        #    tmp_result['exception'] = "{0}".format(e)

        start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])
        yield bytes(json.dumps(tmp_result), 'utf-8')