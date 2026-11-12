---
layout: post
title:  "A Year in the Sky of Uranus"
date:   2026-11-11
categories: projects
tags: javascript, visualization, astronomy
---

**[Open the simulator &rarr;]({{ site.baseurl }}/uranus/)**

Uranus is tipped about 98° on its side. Every other planet spins more or less upright as it goes around the Sun, but Uranus rolls along its orbit like a ball. One consequence: over its 84-year orbit, each pole takes a turn pointing almost straight at the Sun.

I wanted to know what that would actually *look like* from the planet. So I built a little simulator: pick a spot on Uranus, press play, and watch a whole Uranian year go by in about a minute and a half.

## What you'll see

The big circle is the sky as you'd see it lying on your back: the center is straight overhead, the edge is the horizon. The Sun's path for the current day is drawn on it.

Stand at 60° N and run the year. For a while the Sun rises and sets normally. Then it starts spiraling higher, stops setting at all, and circles the sky for years on end. Later it spirals back down, and eventually it disappears for years of night.

Below the sky is a timeline of the whole 84-year orbit, showing how high the Sun gets each day at your latitude. You can drag along it to jump around in time, or hit **Jump to today** to see where Uranus is right now.

## Things to try

- **The poles.** The most dramatic spot: 42 years of daylight followed by 42 years of dark.
- **Your own city's latitude.** There are buttons for a dozen cities on Earth, so you can see what your latitude would get you on Uranus.
- **The equator.** Oddly, the equator gets the strangest sky. At the solstices the Sun skims around the horizon all day, never more than a few degrees up.

## The fine print

It's a simplified model: a perfectly circular orbit, a 17.24-hour day, and a tilt of 97.77°. The real orbit is slightly elliptical, so real solstice and equinox dates differ by a year or two. Uranus also spins "backwards," so the Sun rises in the west. And since there's no solid surface, you're floating somewhere above the clouds.

**[Open the simulator &rarr;]({{ site.baseurl }}/uranus/)**
