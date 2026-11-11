---
layout: post
title:  "Understanding Race and Crime in the US"
date:   2020-08-28
categories: analysis
---

*Revised November 2026: shortened, and a few of the original percentages corrected. The conclusion hasn't changed.*

## The claim

At the start of the 2020 protests I made a few graphs showing how unevenly police killings fall across racial groups. That led to a Twitter exchange with someone who offered a counter-observation: if you divide police killings by **violent crime arrests**, white people come out ahead. In other words, relative to how often each group is arrested for violent crime, more white people are killed by police than Black people.

Call this the "**risk burden**":

> **Risk burden** = (people of a group shot and killed by police) ÷ (people of that group arrested)

They put it at 4 per 10,000 for white people and 3 per 10,000 for Black people, citing [2018 FBI Uniform Crime Reporting arrest data](https://ucr.fbi.gov/crime-in-the-u.s/2018/crime-in-the-u.s.-2018/tables/table-43) and [the Washington Post's 2018 police shootings database](https://www.washingtonpost.com/graphics/2018/national/police-shootings-2018/).

## Checking the numbers

| | Killed by police (2018) | Violent crime arrests (2018) | Risk burden |
| - | -: | -: | -: |
| White | 456 | 230,299 | 19.8 per 10,000 |
| Black | 228 | 146,734 | 15.5 per 10,000 |

The direction holds up, but the numbers don't: both rates are about five times higher than claimed. Taken at face value, the metric says white people are about 27% more likely to be killed per violent crime arrest.

So the question is whether the metric means anything.

## Why it's the wrong yardstick

**Arrests aren't the crime rate.** A crime rate is measured against a population. A raw arrest count isn't, and that was the point of choosing it: it sidesteps the usual approach of comparing each group's deaths to the size of that group.

**People killed by police mostly aren't being arrested for a violent crime.** Dividing deaths by arrests assumes the two go together. But police kill people who weren't committing a violent crime, and sometimes people who weren't committing any crime at all. The metric doesn't account for either.

## The one-third rule

There's a simpler problem. The top number never changes: whatever crime you divide by, it's always 456 white deaths and 228 Black deaths. That's exactly twice as many white deaths.

So the comparison comes down to one question: were Black people more or less than half as many arrests as white people, for the crime you picked? Equivalently, are Black people more or less than **one-third** of the combined white and Black arrests?

- **More than a third:** the metric says white people are at higher risk.
- **Less than a third:** the metric says Black people are at higher risk.

That's all the metric tells you. It doesn't measure risk; it reports the racial mix of whichever arrest category you happen to divide by. Here is every category in the FBI table:

![Black share of arrests by crime category, with the one-third line]({{ site.url }}{{ site.baseurl }}/assets/images/crime-analysis-one-third-rule.png)

Every bar falls on the side the rule predicts. Violent crime overall is 39% Black, just over the line. That's because two of its four parts, murder and robbery, are majority Black. The other two, rape and aggravated assault, are majority white. Pick violent crime, and you've picked the answer.

## All arrests

If you use **every** arrest instead of only violent crime, the result flips:

| | Killed by police | All arrests | Risk burden |
| - | -: | -: | -: |
| White | 456 | 5,319,654 | 8.6 per 100,000 |
| Black | 228 | 2,115,381 | 10.8 per 100,000 |

By the claimant's own metric, Black people are about 26% more likely to be killed per arrest. That's also true in 17 of the 28 individual categories.

The metric also breaks down whenever a category is small. Only 237 white people were arrested for "suspicion" in 2018, so dividing 456 deaths by it gives nearly **two deaths per arrest**. Gambling gives roughly one death for every two arrests. Numbers like that show this isn't a measure of anyone's risk.

## Conclusion

The "risk burden" only favors white people if you choose a slice of arrests where Black people are more than a third of the total. Violent crime happens to be one. Use all arrests and the result reverses. Better yet, compare each group's deaths to the size of that group, which is what the metric was built to avoid.

### For anyone checking the math

```python
deaths  = {'White': 456, 'Black': 228}                 # Washington Post, 2018
violent = {'White': 230_299, 'Black': 146_734}         # FBI Table 43A, 2018
total   = {'White': 5_319_654, 'Black': 2_115_381}

for name, arrests in [('Violent crime', violent), ('All arrests', total)]:
    w = deaths['White'] / arrests['White'] * 100_000
    b = deaths['Black'] / arrests['Black'] * 100_000
    share = arrests['Black'] / (arrests['White'] + arrests['Black'])
    print(f"{name}: white {w:.1f}, Black {b:.1f} per 100k; Black share {share:.0%}")
```
