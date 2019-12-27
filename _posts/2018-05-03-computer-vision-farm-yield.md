---
layout: post
title:  "Farm Yield Dataset"
date:   2018-05-03
categories: data, programming
tags:	data mining, python, computer vision
---
### The Project:
You can find the [FarmYeild Dataset](https://github.com/raulium/FarmYield-Dataset) on github, or you can clone it directly:

`git clone https://github.com/raulium/FarmYield-Dataset.git`

### In the beginning

As a final project for my Computer Vision course, I wanted to perform two tasks:

1. Predict crop yield, given satellite spectral imagery
2. Classify crop type, given the same

In order to do this, I ended up having to build my own dataset in order to perform my work. I was put in contact with a farmer in Illinois that provided raw crop yeild data collected from his harvest over two years, which I parsed in CSV format.

The second half missing was the satellite imagery, which was a multistep process...

1. Identify the spatial grid containing the farm, using lat/long and the [Earth Explorer](https://earthexplorer.usgs.gov) provided by the USGS.
2. Download the appropriate images from [Libra](https://libra.developmentseed.org).
3. Using a combination of [GDAL](https://www.gdal.org) and [geoio](https://pypi.org/project/python-geoio/), correlate the pixels of the imagery with the lat/long measurements provided to me in the yield CSV.

Then it was a matter of collating all the datapoints together into the overall dataset.

It's been anonymized, but none of the lat/long data was important anyway for the purposes of classificaiton and crop yield.

### Results

I wasn't able to predict yield. It happens. I was, however, able to classify the crops as corn or soy beans with a degree of accuracy I was happy with.

You can read more in the [paper](https://github.com/raulium/FarmYield-Dataset/blob/master/paper/CropClassificationPrediction.pdf).