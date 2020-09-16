import React, { useEffect, useState } from 'react';
import apiRequest, { Target } from '../../common/utils/api-request';

export default function TargetPage({ id }: { id: string }): JSX.Element {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect(() => {
    apiRequest.getTarget(id).then(setTarget);
  }, [id]);

  return <div className="target">{target && target.name}</div>;
}
