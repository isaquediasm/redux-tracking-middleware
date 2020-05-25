# Dispatching Promises

## Implicitly

```javascript
const foo = () => ({
  type: 'FOO',
  payload: new Promise()
});
```

## Explicitly

```javascript
const foo = () => ({
  type: 'FOO',
  payload: {
    promise: new Promise()
  }
});
```

## Async/Await

For more on using async/await, [see the guide](async-await.md).

```javascript
const foo = () => ({
  type: 'FOO',
  async payload() {
    const data = await getDataFromApi():

    return data;
  }
});
```

