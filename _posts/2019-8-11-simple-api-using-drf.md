---
layout: post
comments: true
title: Making a Simple REST API Using Django REST Framework
description: Learn how to make a simple REST API using django
tags: [api, django, python, tutorial, rest, django-rest-framework, drf]
image: blog7.png
---
![blog8](https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/blog8.png)

<figcaption style="text-align: center; font-size: 12px;">Image Source <a href="django-rest-framework.org">django-rest-framework.org</a></figcaption>

> Originally published at [iC0DE](https://icodemag.com/making-a-simple-rest-api-using-django-rest-framework/)

## Introduction

Django is a great framework for creating Web Apps but with necessity of Web Apps comes necessity of RESTful APIs. Django REST Framework gives us a great amount of flexibility to create powerful APIs using Django.

Let's Make a Movie API

### SETUP

Let's create a virtual environment first:

```bash
virtualenv -p python3 api && cd api && source bin/activate
```
Now install the **django** and **django-rest-framework** Python packages.

```bash
pip install django django-rest-framework
```
You can run `pip freeze` to see you have following packages installed.

```bash
Django==2.2.3
django-rest-framework==0.1.0
djangorestframework==3.9.4
pytz==2019.1
sqlparse==0.3.0
```
### CREATE A PROJECT

Now let's create a Django Project (Movie API) by running the command below.

```bash
django-admin startproject movieapi
```

If you will see Django creates these files for you automatically.

![](https://icodemag.com/wp-content/uploads/2019/07/blog1.png)

Now let's see if everything is working by running the command below.

```bash
python manage.py migrate
```

If everything goes well you will see the following output in your terminal.

![](https://icodemag.com/wp-content/uploads/2019/07/blog2-298x300.png)

Django provides us with a built-in server for testing our applications.Run the server using

```bash
python manage.py runserver
```

Now open the http://127.0.0.1:8000/ in your browser to see the following Django's welcome page.

![](https://icodemag.com/wp-content/uploads/2019/07/blog3-300x186.png)

### CREATING AN APP

Now we will create a Django App (yes! I know it's confusing sometimes but in Django terminology apps are separate entities in a Web App take it as a subproject inside your main Web App for e.g login/profile etc).

Run the following command to create an app in Django.

```bash
django-admin startapp api
```

You will see a new folder, `API` is created with a bunch of other files.

![](https://icodemag.com/wp-content/uploads/2019/07/blog4-205x300.png)

Now for the app API to work we first have to add it to the `INSTALLED _APPS` list in *settings.py* file.

![](https://icodemag.com/wp-content/uploads/2019/07/blog5-300x169.png)

We will now create a database / tables for our movies and actors in **models.py** file.

from django.db import models

```python
class actor(models.Model):
   name = models.CharField(max_length = 100)

   class Meta:
       verbose_name_plural = "Actors"

   def __str__(self):
      return self.name

class category(models.Model):
    name = models.CharField(max_length = 100)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class movie(models.Model):
    title = models.CharField(max_length = 300)
    actors = models.ManyToManyField(actor)
    categories = models.ManyToManyField(category)

    class Meta:
        verbose_name_plural = "Movies"

    def __str__(self):
        return self.title
```

Once you create your models register them in the admin.py file so that we can access them from the admin panel (will talk about it in a minute). Go to admin.py file and add the following code.

```python
from django.contrib import admin
from .models import category, movie, actor
# Register your models here.

admin.site.register(movie)
admin.site.register(actor)
admin.site.register(category)
```

Now run the following command from the terminal

```bash
python manage.py makemigrations
```

This will create a migration file (*named 0001_initial.py*) inside the migration folder. It contains some information used by Django through which it creates the database tables for us (normally you would have to use SQL to create tables but Django does everything for us).

After this migrate the tables.

```bash
python manage.py migrate
```

This will actually create tables for you in the database.

Now run the following command.

```bash
python manage.py createsuperuser
```

It creates a Django admin user (just like a WordPress C-Panel admin) through which we will be able to see our tables and their data.

Now open the URL http://127.0.0.1:8000/admin/ in your browser.

Add your login credentials and you can see indeed that our models are present in the panel and you can add new movies, actors and categories through this interface (make sure you add some because we will need them in future to test our API).

![](https://icodemag.com/wp-content/uploads/2019/07/blog7-300x155.png)

Now as we know that data from or to an API is exchanged using some formats like JSON, XML etc. We will add this functionality in our API.

Go ahead & create **serializers.py** file inside the `API` folder and add the following code.

```python
from rest_framework import serializers
from . models import actor, movie

class actorSerializer(serializers.ModelSerializer):

    class Meta:
        model = actor
        fields = ('__all__')

class movieSerializer(serializers.ModelSerializer):
    actors = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    categories = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = movie
        fields = ('__all__')
```

### SETTING UP ENDPOINTS

Now we will create out API Endpoints though which we will request our data, create a new file **urls.py** inside the `API` folder and add the following code.

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('movies/', views.movies),
    path('actors/', views.actors),
]
```

We have defined 3 URLs here :

1. http://127.0.0.1:8000/api/ – Home Page for API
2. http://127.0.0.1:8000/api/movies/ – return all movies in the database.
3. http://127.0.0.1:8000/api/actors/ – return all actors in the database.

Make sure you add the api/urls.py inside the movieapi/urls.py. Add the following code inside the movieapi/urls.py file.

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

Now as you can see in the urls.py we were importing some functions from views.py file.

We will now define these functions which will handle the logic for our API.

```python
from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view
from . models import movie, actor
from .serializers import movieSerializer, actorSerializer

# Just wraps a simple HTTP Response to a JSON Response
class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content,**kwargs)

def index(request):
    return HttpResponse("&lt;h3&gt;Welcome to Movie API v1.0&lt;/h3&gt;")

@api_view(['GET'])
def movies(request):
    movies = movie.objects.all()
    serializer = movieSerializer(movies, many=True)
    return JSONResponse(serializer.data)

@api_view(['GET'])
def actors(request):
    actors = actor.objects.all()
    serializer = actorSerializer(actors, many=True)
    return JSONResponse(serializer.data)
```

As you can see we have defined 3 functions which handle our API Endpoints:

- The function named index() handles the root of our API, it just returns an HTTP response Welcome to Movie API v1.0.
- In the movies() function we are querying all the movie objects from the database and applying the serializer to it which we made earlier. The same stuff is happening in the actor function as well.
- @api_view is a python decorator which is used here to specify that only GET request should invoke this method.
- The class JSONResponse is just used to wrap the database objects into a JSON format.

### Result

Now if you will head over to http://127.0.0.1:8000/api/movies/ in your browser ,you will see that our API is indeed working and returning data in JSON format.

![result](https://icodemag.com/wp-content/uploads/2019/07/blog8-300x214.png)