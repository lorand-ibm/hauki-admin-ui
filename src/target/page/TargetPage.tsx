import React, { useEffect, useState } from 'react';
import api, { Target } from '../../common/utils/api/api';

export default function TargetPage({ id }: { id: string }): JSX.Element {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect((): void => {
    // UseEffect's callbacks are synchronous to prevent a race condition.
    // We can not use an async function as an useEffect's callback because it would return Promise<void>
    api.getTarget(id).then(setTarget);
  }, [id]);
  return <h1>{target && target.name}</h1>;
}
