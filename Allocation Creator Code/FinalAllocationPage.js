import React from "react";
import numeral from "numeral";
import clockImage from "../../../assets/images/allocate.svg";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Avatar from "@material-ui/core/Avatar";
import {
  usePersonalConversions,
  calculateTotals,
  calculateField
} from "./AllocationFunctions";

class FinalAllocationPage extends React.Component {
  state = {
    chosenActivities: this.props.chosenActivities,
    calculatedTotals: {
      hours: 0,
      LeadConversionRate: 0,
      txWeek: 0,
      txYear: 0,
      leadsWeek: 0,
      leadsYear: 0,
      netIncomeWeek: 0,
      netIncomeYear: 0
    },
    hoursChosenTotals: {
      green: 0.0,
      yellow: 0.0,
      red: 0.0
    }
  };

  componentDidMount() {
    this.loadConversionRates();
  }

  loadConversionRates = () => {
    let activities = [...this.state.chosenActivities];
    let chosenActivities = usePersonalConversions(
      activities,
      this.props.conversionRates
    );
    let calculatedTotals = calculateTotals(chosenActivities);
    let hoursChosenTotals = this.sumHoursChosen();
    this.setState({ chosenActivities, calculatedTotals, hoursChosenTotals });
  };

  updateActivityHours = event => {
    let chosenActivities = [...this.state.chosenActivities];
    let i = this.findChosenActivity(event.target.name);
    let calculatedTotals = {};
    let hoursChosenTotals = {};

    chosenActivities[i].hours =
      event.target.value === "" ? 0 : event.target.value;
    chosenActivities[i] = calculateField(
      chosenActivities[i],
      this.props.userPlan.expectedNetOutcome
    );
    calculatedTotals = calculateTotals(chosenActivities);
    hoursChosenTotals = this.sumHoursChosen(chosenActivities);
    this.setState({ chosenActivities, calculatedTotals, hoursChosenTotals });
  };

  sumHoursChosen = () => {
    const chosenActivities = [...this.state.chosenActivities];
    let hoursChosenTotals = { green: 0, yellow: 0, red: 0 };
    for (let activity of chosenActivities) {
      let hours = parseFloat(activity.hours);
      if (activity.categoryId === 2) {
        hoursChosenTotals.green += hours;
      } else if (activity.categoryId === 3) {
        hoursChosenTotals.yellow += hours;
      } else if (activity.categoryId === 4) {
        hoursChosenTotals.red += hours;
      }
    }
    return hoursChosenTotals;
  };

  findChosenActivity = activityName => {
    let i = 0;
    while (this.state.chosenActivities[i].name != activityName) {
      i++;
    }
    return i;
  };

  mapInputs = (activity, activityCategoryToMap) => {
    if (activity.categoryId === activityCategoryToMap) {
      return (
        <div key={activity.name} className="inputBox">
          <InputLabel style={{ paddingTop: "1.5rem", width: "70%" }}>
            {activity.name}
          </InputLabel>
          <FilledInput
            type="number"
            style={{ width: "9rem", marginRight: ".5rem" }}
            defaultValue={activity.hours}
            inputProps={{
              style: { textAlign: "end", fontSize: "1.25rem" },
              min: 0,
              step: 0.5
            }}
            name={activity.name}
            endAdornment={
              <InputAdornment position="end" style={{ paddingTop: "1.5rem" }}>
                Hrs
              </InputAdornment>
            }
            onChange={this.updateActivityHours}
            step={0.5}
            min={0}
          />
        </div>
      );
    }
  };

  mapInputBoxes = (activityCategoryToMap, color, title, ammountToDisplay) => {
    const { chosenActivities } = this.props;
    return (
      <React.Fragment>
        <Divider style={{ marginBottom: "2rem", marginTop: "2rem" }} />
        <div className="activityCategoryTitleBox">
          <Typography
            variant="title"
            align="left"
            gutterBottom={true}
            style={{ color: color, marginRight: "1.5rem" }}
          >
            {title}:
          </Typography>
          {this.mapTotalsAvatar(ammountToDisplay, color)}
        </div>

        <div className="activityButtonBox">
          {chosenActivities.map(activity =>
            this.mapInputs(activity, activityCategoryToMap)
          )}
        </div>
      </React.Fragment>
    );
  };

  mapMetricsBox = (title, ammountToDisplay) => {
    if (title === "Income Goals" || title === "Budget Expenses") {
      ammountToDisplay = numeral(ammountToDisplay).format("$0,0.00");
    }
    return (
      <div style={{ width: "60%", margin: "0 auto" }}>
        <Typography variant="h6" align="center" gutterBottom={true}>
          {title}
        </Typography>
        <Typography variant="body1" align="center" style={{ fontSize: "1rem" }}>
          {ammountToDisplay}
        </Typography>
      </div>
    );
  };

  mapTotalsAvatar = (ammountToDisplay, color) => {
    return (
      <React.Fragment>
        <Avatar
          style={{
            color: "white",
            width: "4rem",
            height: "4rem",
            backgroundColor: color
          }}
        >
          {ammountToDisplay}
        </Avatar>
      </React.Fragment>
    );
  };

  render() {
    const { userPlan } = this.props;
    const { calculatedTotals, hoursChosenTotals } = this.state;
    return (
      <div>
        <div className="activityPickerText">
          <div className="pickerImageBox">
            <img src={clockImage} alt="icon" className="pickerImage" />
          </div>
          <div style={{ marginTop: "7em" }}>
            <Typography variant="h5" align="center" gutterBottom={true}>
              Finally, decide how many hours you want to devote each week to
              every activity you've chosen.
            </Typography>
          </div>
        </div>
        <div className="businessPlanReview">
          <Typography variant="h5" align="center" gutterBottom={true}>
            Business Plan Review
          </Typography>
          <Divider style={{ marginBottom: "2rem" }} />
          <div className="metricsBox">
            {this.mapMetricsBox("Income Goals", userPlan.revenueGoal)}
            {this.mapMetricsBox("Budget Expenses", userPlan.expenseBudget)}
            {this.mapMetricsBox("Expected Hours", userPlan.expectedHours)}
            {this.mapMetricsBox(
              "Annual Prospects Needed",
              (userPlan.yearlyClosesNeeded * 49).toFixed(2) //Based on internal 49 to 1 ratio of prospects converted to sales
            )}
            {this.mapMetricsBox(
              "Annual Closings",
              calculatedTotals.txYear.toFixed(2)
            )}
            {this.mapMetricsBox(
              "Monthly Closings",
              (calculatedTotals.txWeek * 4).toFixed(2)
            )}
            {this.mapMetricsBox(
              "Monthly Prospects",
              (calculatedTotals.leadsWeek * 4).toFixed(2)
            )}
            {this.mapMetricsBox(
              "Daily Prospects",
              (calculatedTotals.leadsWeek / 7).toFixed(2)
            )}
          </div>
        </div>
        <div className="allocationBox">
          {this.mapInputBoxes(
            2,
            "green",
            "Green Time Total",
            hoursChosenTotals.green
          )}
          {this.mapInputBoxes(
            3,
            "goldenRod",
            "Yellow Time Total",
            hoursChosenTotals.yellow
          )}
          {this.mapInputBoxes(
            4,
            "red",
            "Red Time Total",
            hoursChosenTotals.red
          )}
        </div>
      </div>
    );
  }
}

export default FinalAllocationPage;
