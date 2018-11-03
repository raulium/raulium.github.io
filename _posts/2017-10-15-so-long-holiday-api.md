---
layout: posts
title:  "So Long Holiday API, and Thanks For All The Fish"
date:   2017-10-15
categories: home_automation
tags:	api, python
---
I woke up this morning later than I expected to, because my alarm didn't go off.  This wasn't really a problem given it is a Sunday, but it was concerning as my computer does this task for me.

I've been refactoring my personal assistant program that, among many things, regulates my sleeping schedule and I thought perhaps I broke something (as I am wont to do... often).  Though, upon inspection I came to find that it wasn't my fault, but rather that my holiday function wasn't working.

{% highlight python %}
def holidayDict():
	year = str(datetime.now().year)
	month = str(datetime.now().month)
	day = str(datetime.now().day)
     
	url = "https://holidayapi.com/v1/holidays?key=" + HOLIDAY_KEY +"&country=US&year=" + year + "&month=" + month + "&day=" + day
	agent = MyOpener()
	page = agent.open(url)
	jsonurl = page.read()
	data = json.loads(jsonurl)
	if len(data['holidays']) > 0:
		print(data)
		return str(data["holidays"][0]["name"])
	else:
		return None
{% endhighlight %}

It's not the most elegant code, but it returns today's holiday as a string (if it is a holiday), or returns `None` if today isn't special.  It does this by reaching out to [Holiday API](holidayapi.com) (a wonderful, simple, RESTful API with an exhaustive list of country holidays worldwide) to ask, "is today a holiday?" Normally, I get a json object back which I can treat like a dictionary:

{% highlight python %}
{"status":200,"holidays":[]}
{% endhighlight %}

Which tells me, "No. Today isn't special."  Or:

{% highlight python %}
{"status":200,"holidays":[{"name":"Last Day of Kwanzaa","date":"2017-01-01","observed":"2017-01-01","public":false},{"name":"New Year's Day","date":"2017-01-01","observed":"2017-01-02","public":true}]}
{% endhighlight %}

Which tells me all **sorts** of things are going on.

Unfortunately for me, today I got a response I was not expecting:

{% highlight python %}
{"status":402,"error":"Free accounts are limited to historical data. Upgrade to premium for access to current and upcoming holiday data. Log into your account for upgrade options!"}
{% endhighlight %}

Which tells me if I want to know if today is a holiday, I have to pay $9/mo.  Disappointing.  Of course, I get it -- this service has been free for quite some time, and I've been benefiting off the hard work of the likes of [Josh Sherman](https://twitter.com/joshtronic) for a fortnight.  Given how lovely the Holiday API service is, it's not an outrageous assumption to say how popular it probably is, and bandwidth isn't free; neither is hosting, or domain registration, etc. -- so I wish them all the best in their future.

However, my use case is an alarm clock for which I'm not about to spend a monthly subscription to run on my own computer.   Thankfully, someone has already made [a python library which handles holidays](https://pypi.python.org/pypi/holidays) with the bonus of supporting **custom holidays** as well!  So now that I've found my henceforth solution, I've updated my holidayDict function:

{% highlight python %}
def holidayDict():
	us_holidays = holidays.UnitedStates()
	t = datetime.now().date()

	if (t in us_holidays):
		return us_holidays.get(t)
	else:
		return None
{% endhighlight %}

Much better, methinks.
