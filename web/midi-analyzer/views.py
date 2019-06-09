from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import default_storage, File
from django.conf import settings

import os
from .midiutil import midiutil


def index(request):

    return render(request, 'midi-analyzer/index.html')


def analyze(request):

    midi_file = request.FILES['midi-file']
    track_name = request.POST['selectedTrackName'][2:]

    path = default_storage.save('midifile.mid', File(midi_file))
    result = midiutil.parse_midi(os.path.join(settings.MEDIA_ROOT, path), track_name)

    return JsonResponse({'nya': 'wan'})

