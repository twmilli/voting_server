export function setState(state){
  return({
    type: 'SET_STATE', state
  });
}

export function delete_topic(i){
  return ({
    type: 'DELETE', i, meta: {remote: true}
  })
}

export function addTopic(title, choices, creator){
  return({
    type: 'ADD_TOPIC', title, choices, creator, meta:{remote: true}
  });
}

export function addChoice(i, choice){
  return({
    type: 'ADD_CHOICE', i, choice, meta: {remote: true}
  });
}
