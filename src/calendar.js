/** @jsx React.DOM */

var Day = require('./day');
var DateUtil = require('./util/date');

var Calendar = React.createClass({
  mixins: [require('react-onclickoutside')],

  handleClickOutside: function() {
    this.props.hideCalendar();
  },

  getInitialState: function() {
    var nextMonth,
        flag = false,
        date = new DateUtil(this.props.selected).safeClone(moment());

    // If there is a start date and an end date (selected)
    if (this.props.test == 'end' && !! this.props.minDate && !! this.props.selected && ! this.props.rangeEnd) {
      nextMonth = date;
      date = new DateUtil(this.props.minDate).safeClone(moment());
      flag = true;
    // If there is an end date and an start date (selected)
    } else if (this.props.test == 'start' && !! this.props.rangeEnd && !! this.props.selected) {
      nextMonth = new DateUtil(this.props.rangeEnd).safeClone(moment());
      flag = true;
    } else {
      if (!!this.props.minDate && this.props.minDate.isAfter(moment())) {
        date = new DateUtil(this.props.minDate).safeClone();
      }
      nextMonth = new DateUtil(date._date).addMonth();
    }

    return {
      hoverDate: new DateUtil(null),
      date: date,
      rangeEnd: new DateUtil(this.props.rangeEnd).safeClone(),
      nextMonth: nextMonth,
      dayTest: true,
      flag: flag
    };
  },

  componentWillReceiveProps: function(nextProps) {
    // When the selected date changed
    if (nextProps.selected !== this.props.selected) {
      var date = new DateUtil(nextProps.selected).safeClone(moment());

      this.setState({
        date: date,
        nextMonth: new DateUtil(date._date).addMonth()
      });
    }
  },

  increaseMonth: function() {
    var date, nextMonth;
    if (this.state.flag && (this.state.nextMonth._date.month() - this.state.date._date.month()) > 1) {
      date = this.state.date.addMonth();
      nextMonth = this.state.nextMonth;
    } else {
      date = this.state.date.addMonth();
      nextMonth = this.state.nextMonth.addMonth();
    }
    this.setState({
      date: date,
      nextMonth: nextMonth
    });
  },

  decreaseMonth: function() {
    var date, nextMonth;
    if (this.state.flag && (this.state.nextMonth._date.month() - this.state.date._date.month()) > 1) {
      date = this.state.date;
      nextMonth = this.state.nextMonth.subtractMonth();
    } else {
      date = this.state.date.subtractMonth();
      nextMonth = this.state.nextMonth.subtractMonth();
    }
    this.setState({
      date: date,
      nextMonth: nextMonth
    });
  },

  weeks: function() {
    return this.state.date.mapWeeksInMonth(this.renderWeek);
  },

  nextMonthWeeks: function() {
    return this.state.nextMonth.mapWeeksInMonth(this.renderNextMonthWeek);
  },

  handleDayClick: function(day) {
    this.props.onSelect(day);
  },

  renderWeek: function(weekStart, key) {
    if(! weekStart.weekInMonth(this.state.date)) {
      return;
    }

    return (
      <div key={key}>
        {this.days(weekStart)}
      </div>
    );
  },

  renderNextMonthWeek: function(weekStart, key) {
    if(! weekStart.weekInMonth(this.state.nextMonth)) {
      return;
    }

    return (
      <div key={key} className="week">
        {this.days(weekStart)}
      </div>
    );
  },

  handleHover: function(day) {
    this.setState({
      hoverDate: day
    });
  },

  dropIt: function() {
    this.setState({
      dayTest: false
    });
  },

  donde: function() {
    this.setState({
      dayTest: true
    });
  },

  renderDay: function(day, key) {
    var minDate = new DateUtil(this.props.minDate).safeClone(),
        maxDate = new DateUtil(this.props.maxDate).safeClone(),
        disabled = day.isBefore(minDate) || day.isAfter(maxDate);

    if (!this.props.minDate) {
      minDate = new DateUtil(this.props.selected);
    }

    return (
      <Day
        key={key}
        day={day}
        date={this.state.date}
        hoverDate={this.state.hoverDate}
        nextMonth={this.state.nextMonth}
        rangeStart={minDate}
        rangeEnd={this.state.rangeEnd}
        test={this.state.dayTest}
        onHover={this.handleHover}
        onClick={this.handleDayClick.bind(this, day)}
        selected={new DateUtil(this.props.selected)}
        disabled={disabled} />
    );
  },

  days: function(weekStart) {
    return weekStart.mapDaysInWeek(this.renderDay);
  },

  render: function() {
    return (
      <div className="datepicker" onMouseLeave={this.dropIt} onMouseEnter={this.donde}>
        <div className="datepicker__triangle"></div>
        <div className="datepicker__month datepicker__month--current">
          <div className="datepicker__header">
            <a className="datepicker__navigation datepicker__navigation--previous"
                onClick={this.decreaseMonth}>
            </a>
            <span className="datepicker__date">
              {this.state.date.format("MMMM YYYY")}
            </span>
            <div>
              <div className="datepicker__day">Mo</div>
              <div className="datepicker__day">Tu</div>
              <div className="datepicker__day">We</div>
              <div className="datepicker__day">Th</div>
              <div className="datepicker__day">Fr</div>
              <div className="datepicker__day">Sa</div>
              <div className="datepicker__day">Su</div>
            </div>
          </div>
          <div className="datepicker__weeks">
            {this.weeks()}
          </div>
        </div>
        <div className="datepicker__month datepicker__month--next">
          <div className="datepicker__header">
            <span className="datepicker__date">
              {this.state.nextMonth.format("MMMM YYYY")}
            </span>
            <a className="datepicker__navigation datepicker__navigation--next"
                onClick={this.increaseMonth}>
            </a>
            <div>
              <div className="datepicker__day">Mo</div>
              <div className="datepicker__day">Tu</div>
              <div className="datepicker__day">We</div>
              <div className="datepicker__day">Th</div>
              <div className="datepicker__day">Fr</div>
              <div className="datepicker__day">Sa</div>
              <div className="datepicker__day">Su</div>
            </div>
          </div>
          <div className="datepicker__weeks">
            {this.nextMonthWeeks()}
          </div>
         </div>
       </div>
    );
  }
});

module.exports = Calendar;
