from django.shortcuts import render
from django.http import JsonResponse

from .midi_util import midi_util, note

def index(request):
    return render(request, 'midi-analyzer/index.html')

def parse(request):
    res = JsonResponse(
        {'nyan': 'wan'}
    )
    return res

