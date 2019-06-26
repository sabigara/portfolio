from django.shortcuts import render
from django.http import HttpResponse
from django.core.mail import send_mail
from django.template import loader


def index(request):
    return render(request, 'portfolio-site/index.html')


def contact(request):
    name = request.POST['name']
    kana = request.POST['kana']
    message = request.POST['message']
    email = request.POST['email']

    send_mail(
        f'{name}（{kana}）さんからの問い合わせ',
        f'返信先： {email}\n\n{message}',
        email,
        ['lemonburst1958@gmail.com'],
        fail_silently=False
    )
    return HttpResponse(status=200)
