import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

class DefaultLogoIcon extends Component {
  static defaultProps = {
    height: 32,
  };
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    dark: PropTypes.bool,
  };

  render() {
    const { dark, height, width } = this.props;
    return (
      <svg
        className={cx("Icon", { "text-brand": !dark }, { "text-white": dark })}
        width={width}
        height={height}
        fill="currentcolor"
        data-testid="main-logo"
        viewBox="0 0 600 600"
        version="1.1"
      >
        <title>taric</title>
        <g
          id="taric"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="Group"
            transform="translate(65.000000, 57.000000)"
            fill="#2CB373"
          >
            <path
              d="M423.139346,0.907213451 L273.226001,38.9138835 L273.226001,38.9138835 C268.496986,44.1674393 266.132479,47.8333584 266.132479,49.9116408 C266.132479,51.9899231 266.132479,53.9218256 266.132479,55.7073483 L311.544841,224.957265 C375.639026,207.35894 417.319889,188.269707 436.587431,167.689564 C455.854972,147.109422 466.992495,109.782016 470,55.7073483 C467.122515,36.5223146 463.118297,23.6278468 457.987346,17.0239451 C453.268225,10.9500986 444.072317,5.66232088 430.399623,1.16061204 C428.052784,0.38792273 425.534345,0.30002312 423.139346,0.907213451 Z"
              id="Path-2"
            />
            <path
              d="M14.4243654,46.6022805 C10.8094427,59.0295641 8.38860515,68.7763355 7.1618527,75.8425945 C0.340756829,115.133024 -0.438803169,153.066091 0.165204248,171.71278 C2.06783097,230.449951 23.6725729,274.604998 35.6207644,306.41775 C55.0874247,358.248861 104.278974,417.797645 183.195413,485.064103 C233.929716,465.103435 269.525092,448.222319 289.98154,434.420753 C342.432993,399.032781 380.563313,352.142354 402.245143,319.656161 C422.841292,288.79666 451.588665,240.362624 463.618263,183.355819 C468.979946,157.947456 470.963124,115.491619 469.567796,55.98831 C436.172356,107.795182 412.093279,141.692285 397.330564,157.679618 C381.91624,174.372614 322.908555,219.591043 306.64308,227.459204 C258.881027,250.563324 211.275619,266.844562 163.826857,276.302918 L208.925645,96.8903785 C209.998392,92.6227621 207.423133,88.289964 203.161737,87.1927702 L24.1007023,41.089427 C19.9156901,40.011899 15.6314006,42.4527674 14.4243654,46.6022805 Z"
              id="Path"
            />
          </g>
        </g>
      </svg>
    );
  }
}

export default function LogoIcon(props) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
