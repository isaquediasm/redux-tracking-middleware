# Design Principles

## Events as meaningful Actions

Events should be triggered by meaningful data actions rather than simple UI interactions. For example, consider a registration process described below:

```
1. User fills up form [UI Event]
2. User clicks on Submit button [UI Event]
3. Data is sent to API [Data Action]
4. API returns a success or failure status [Data Action]
```

A successful registration can just be assumed by the stage 4, where the fetching promise is settled with the respective response, therefore is where the event trackig is supposed to be placed.

## Action Objects Describe State Changes to the Store

An action object describes changes to the store. Actions are the only source of information for the store.

See more: [Redux Documentation](http://redux.js.org/docs/basics/Actions.html).

## Use Flux Standard Action (FSA)

For better results on your events semantics, comply with [the Flux Standard Action](https://github.com/acdlite/flux-standard-action) reccommendations.
