# Recipe Slash Command for Mixmax

This is an open source Mixmax Slash Command. See <http://developer.mixmax.com/docs/overview-slash-commands#tutorial-building-mygiphy> for more a tutorial on how to code using Mixmax API.

![alt text](peepshi_demonstration.gif "Demonstration Gif")

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To simulate locally how Mixmax calls the typeahead URL (to return a JSON list of typeahead results), run:

```
curl http://localhost:9145/typeahead?ingredients=cheese
```

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl http://localhost:9145/resolver?ingredients=cheese
```

### Sources
**Food2Fork API:** http://food2fork.com/about/api

**Mixmax API:** http://developer.mixmax.com/
