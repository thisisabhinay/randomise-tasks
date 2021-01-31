import React from "react";
import "./Card.scss";

const Card = ({ heading, list, selector }) => {
  return (
    <div className={`card card--${selector}`}>
      <div className="container container--big">
        <h1 className={`heading heading--${selector}`}>{heading}</h1>
        <ul className={`list list--${selector}`}>{list}</ul>
      </div>
    </div>
  );
};

export default Card;
