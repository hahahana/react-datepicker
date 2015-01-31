/** @jsx React.DOM */

var Day = React.createClass({
  getInitialState: function() {
    return {
      isDisabled: this.props.day.isBefore(this.props.minDate) || this.props.day.isAfter(this.props.maxDate)
    };
  },

  handleClick: function(e) {
    if (this.state.isDisabled) {
      e.stopPropagation();
    } else {
      this.props.onClick();
    }
  },

  render: function() {
    classes = React.addons.classSet({
      'datepicker__day': true,
      'datepicker__day--disabled': this.state.isDisabled,
      'datepicker__day--selected': this.props.day.sameDay(this.props.selected),
      'datepicker__day--this-month': this.props.day.sameMonth(this.props.date),
      'datepicker__day--today': this.props.day.sameDay(moment())
    });

    return (
      <div className={classes} onClick={this.handleClick}>
        {this.props.day.day()}
      </div>
    );
  }
});

module.exports = Day;
