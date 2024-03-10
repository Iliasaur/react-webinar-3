import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import {numberFormat} from "../../utils";
import './style.css';

function BasketTotal({sum, labelTotal}) {
  const cn = bem('BasketTotal');
  console.log('BasketTotal');
  return (
    <div className={cn()}>
      <span className={cn('cell')}>{labelTotal}</span>
      <span className={cn('cell')}> {numberFormat(sum)} ₽</span>
      <span className={cn('cell')}></span>
    </div>
  );
}

BasketTotal.propTypes = {
  sum: PropTypes.number,
  labelTotal: PropTypes.string
};

BasketTotal.defaultProps = {
  sum: 0,
  labelTotal: 'total'
}

export default memo(BasketTotal);
