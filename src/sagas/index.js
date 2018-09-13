export function* mainProcess() {
}

export default function* root() {
  yield all([ fork(mainProcess) ])
}



