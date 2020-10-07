import React, { ReactNode, useEffect, useState } from 'react';
import { Notification } from 'hds-react';
import api, {
  Target,
  SourceLink,
  SourceLinkTypes,
} from '../../common/utils/api/api';
import Collapse from '../../components/collapse/Collapse';
import './TargetPage.scss';

const hasText = (str: string | null | undefined): boolean =>
  str !== undefined && str !== null && str !== '';

const getTargetSourceLink = (links: SourceLink[] = []): string | undefined => {
  const adminLink = links.find(
    (link) => link.link_type === SourceLinkTypes.ADMIN
  );
  return adminLink?.url;
};

const TargetInfo = ({ target }: { target?: Target }): JSX.Element => (
  <>
    <h1 className="target-info-title">{target?.name}</h1>
    {hasText(target?.address) && (
      <div>
        <span>Osoite: </span>
        <address className="target-info-address">
          {hasText(target?.address)
            ? target?.address
            : 'Toimipisteellä ei ole nimeä.'}
        </address>
      </div>
    )}
  </>
);

const TargetSection = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}): JSX.Element => (
  <section id={id} className="target-details-section">
    {children}
  </section>
);

const TargetDetailsSection = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}): JSX.Element => (
  <TargetSection id={id}>
    <Collapse isOpen collapseContentId={`${id}-section`} title={title}>
      {children}
    </Collapse>
  </TargetSection>
);

const TargetSourceLink = ({
  id,
  target,
}: {
  id: string;
  target?: Target;
}): JSX.Element | null => {
  if (!target) {
    return null;
  }
  const url = getTargetSourceLink(target.links);

  return (
    <TargetSection id={id}>
      <p>
        Toimipisteeseen liittyvät tiedot kieliversioineen ovat lähtöisin
        Toimipisterekisteristä. Jos haluat muuttaa tietoja, se on mahdollista
        Toimipisterekisterissä.
      </p>
      <a href={url}>Tarkastele toimipisteen tietoja Toimipisterekisterissä</a>
    </TargetSection>
  );
};

export default function TargetPage({ id }: { id: string }): JSX.Element {
  const [target, setTarget] = useState<Target | undefined>(undefined);
  const [hasError, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect((): void => {
    // UseEffect's callbacks are synchronous to prevent a race condition.
    // We can not use an async function as an useEffect's callback because it would return Promise<void>
    api
      .getTarget(id)
      .then((t: Target) => {
        setTarget(t);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e);
        setLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <p>Toimipisteen tietoja ladataan...</p>;
  }

  if (hasError) {
    return (
      <Notification label="Toimipistettä ei saatu ladattua." type="error">
        Tarkista toimipiste-id.
      </Notification>
    );
  }

  return (
    <>
      <TargetInfo target={target} />
      <TargetDetailsSection id="target-description" title="Perustiedot">
        <p className="target-description-text">
          {hasText(target?.description)
            ? target?.description
            : 'Toimipisteellä ei ole kuvausta.'}
        </p>
      </TargetDetailsSection>
      <TargetSourceLink id="target-source-link" target={target} />
    </>
  );
}
