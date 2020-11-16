# API Specification

### Settings object

| Property  | Description                                                   | Type                                 | Default |
| --------- | ------------------------------------------------------------- | ------------------------------------ | ------- |
| pattern   | Determine which actions should be tracked                     | RegEx or Function                    | `*`     |
| track     | Callback function called when action is finally tracked       | Function(action, { state, context }) |
| transform | Modify the action object before it reaches the `track` method | Function(action, { state, context }) |
