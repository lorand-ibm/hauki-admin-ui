import React, { useEffect, useState } from 'react';
import api, { Target } from '../../common/utils/api/api';

export default function TargetPage({ id }: { id: string }): JSX.Element {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect(() => {
    api.getTarget(id).then(setTarget);
  }, [id]);

  return <div className="target">{target && target.name}</div>;
}
