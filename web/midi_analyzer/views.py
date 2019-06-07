from django.shortcuts import render

def index(request):
    return render(request, 'midi_analyzer/index.html')