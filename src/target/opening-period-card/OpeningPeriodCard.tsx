import { IconCogwheel } from 'hds-react';
import React from 'react';
import './OpeningPeriodCard.scss';

export default function OpeningPeriodCard(): JSX.Element {
  return (
    <div className="opening-period-card">
      <div className="opening-period-card-header">
        <h4>Kevätaukioloajat</h4>
        <IconCogwheel className="opening-period-cogwheel-icon" />
      </div>
      <h5>3.3.2020 — 20.6.2020</h5>
      <div className="opening-hours-column">
        <p>maanantai</p>
        <p>tiistai</p>
        <p>keskiviikko</p>
        <p>torstai</p>
        <p>perjantai</p>
        <p>lauantai</p>
        <p>sunnuntai</p>
      </div>
      <div className="opening-hours-column">
        <p>8.30 — 20.00</p>
        <p>8.30 — 20.00</p>
        <p>8.30 — 20.00</p>
        <p>8.30 — 20.00</p>
        <p>8.30 — 20.00</p>
        <p>8.30 — 20.00</p>
        <p>suljettu</p>
      </div>
      <p className="opening-period-description">
        Nyt voit nauttia kirjaston palveluista entistä aiemmin aamulla!
      </p>
    </div>
  );
}
