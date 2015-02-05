/** @jsx React.DOM */

var Day = React.createClass({
  handleHover: function() {
    this.props.onHover(this.props.day);
  },

  render: function() {
    var x = this.props.test && this.props.day.isAfter(this.props.rangeStart) && this.props.day.isBefore(this.props.hoverDate);
    var y = this.props.test && this.props.day.isAfter(moment()) && this.props.day.isBefore(this.props.hoverDate);

    classes = React.addons.classSet({
      'datepicker__day': true,
      'datepicker__day--today': this.props.day.sameDay(moment()),
      'datepicker__day--disabled': this.props.disabled,
      'datepicker__day--selected': this.props.day.sameDay(this.props.selected),
      'datepicker__day--this-month': this.props.day.sameMonth(this.props.date),
      'datepicker__day--next-month': this.props.day.sameMonth(this.props.nextMonth),
      'datepicker__day--range-start': this.props.day.sameDay(this.props.rangeStart),
      'datepicker__day--range-end': this.props.day.sameDay(this.props.rangeEnd),
      'datepicker__day--between': x,
      'datepicker__day--between2': this.props.day.isAfter(this.props.rangeStart) && this.props.day.isBefore(this.props.rangeEnd)
    });

    return (
      <div className={classes} onClick={this.props.disabled ? null : this.props.onClick} onMouseEnter={this.handleHover}>
        {this.props.day.day()}
      </div>
    );
  }
});

module.exports = Day;
