from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.core.files.storage import default_storage, File
from django.conf import settings

import os
from tempfile import TemporaryDirectory
from .midiutil import midiutil


def index(request):

    return render(request, 'midi-analyzer/index.html')


def analyze(request):

    midi_file = request.FILES['midi-file']
    # Exclude first 2 letters, which are added by JS
    track_name = request.POST['selectedTrackName'][2:]

    with TemporaryDirectory() as tdir:
        midi_file_path = os.path.join(tdir, midi_file.name)
        with open(midi_file_path, 'wb+') as file:
            for chunk in midi_file.chunks():
                file.write(chunk)

        result = midiutil.parse_midi(midi_file_path, track_name)
        if not result:
            return HttpResponseBadRequest('解析不能なMIDIファイルです')

        str_result = ''
        for line in result:
            for chord in line:
                str_result += chord + '   '
            str_result += '\n'

        with open(os.path.join(tdir, 'result.txt'), 'w') as result_file:
            result_file.write(str_result)

        with open(os.path.join(tdir, 'result.txt')) as result_file:
            res = HttpResponse()
            res.content = result_file
            res.content_type = 'text/plain'
            res['Content-Disposition'] = 'attachment;filename=result.txt'

    return res
