import React from "react";
import "./ActivityAllocationPage.css";
import FinalAllocationPage from "./FinalAllocationPage";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import MobileStepper from "@material-ui/core/MobileStepper";
import Step from "@material-ui/core/Step";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import StepLabel from "@material-ui/core/StepLabel";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import ActivityPicker from "./ActivityPicker";
import relax from "../../../assets/images/relax2.svg";
import admin from "../../../assets/images/admin.svg";
import forSale from "../../../assets/images/forsale.svg";
import { getAll } from "../../../services/activitytype.service";
import {
  saveAaTemplate,
  getTemplateNames,
  getTemplateValues,
  getTxConvRates
} from "../../../services/Dashboard.service";
import { getPlanById } from "../../../services/planService";
import { connect } from "react-redux";

class ActivityAllocationPage extends React.Component {
  state = {
    activeStep: 0,
    allActivities: [],
    chosenActivities: [],
    errorText: "",
    isSaveModalOpen: false,
    templateName: "",
    templateNames: [],
    conversionRates: [],
    userPlan: {}
  };

  async componentDidMount() {
    this.loadActivityTypes();
    this.loadExistingAllocationNames();
    this.loadUserConversionRates();
    this.loadUserPlan();
  }

  loadActivityTypes = async () => {
    try {
      let allActivitiesCall = await getAll();
      let allActivities = allActivitiesCall.data.items.map(activity => ({
        ActivityId: activity.id,
        name: activity.name,
        categoryId: activity.categoryId,
        hours: 0,
        LeadConversionRate: 0,
        txWeek: 0,
        txYear: 0,
        leadsWeek: 0,
        leadsYear: 0,
        netIncomeWeek: 0,
        netIncomeYear: 0
      }));
      this.setState({ allActivities });
    } catch (e) {
      console.log(`Failed to load activites: ${e}`);
    }
  };

  loadExistingAllocationNames = async () => {
    try {
      let templateNamesCall = await getTemplateNames();
      this.setState({ templateNames: templateNamesCall.data.pagedItems });
    } catch (e) {
      console.log(`Failed to load template names: ${e}`);
    }
  };

  loadUserConversionRates = async () => {
    try {
      let conversionRatesCall = await getTxConvRates(this.props.userId);
      this.setState({ conversionRates: conversionRatesCall.data.pagedItems });
    } catch (e) {
      console.log(`Failed to load personal conversions ${e}`);
    }
  };

  loadUserPlan = async () => {
    try {
      let userPlanCall = await getPlanById(this.props.userId);
      this.setState({ userPlan: userPlanCall.data.item });
    } catch (e) {
      console.log(`Failed to load plan: ${e}`);
    }
  };

  advanceStep = () => {
    let activeStep = this.state.activeStep + 1;
    this.setState({ activeStep });
  };

  backStep = () => {
    let activeStep = this.state.activeStep - 1;
    activeStep = activeStep < 0 ? 0 : activeStep;
    this.setState({ activeStep });
  };

  handleDialogToggle = () => {
    let isSaveModalOpen = !this.state.isSaveModalOpen;
    this.setState({ isSaveModalOpen });
  };

  handleInputChange = event => {
    //Turn off the error if user changes input after being notified.
    if (this.state.errorText != "") {
      this.toggleErrorText();
    }
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTemplateSave = () => {
    if (this.templateNameExists(this.state.templateName)) {
      if (this.state.errorText === "") {
        this.toggleErrorText();
      }
    } else {
      try {
        //Save function goes here.
      } catch (e) {
        console.log(`Allocation save failed:${e}`);
      }
    }
  };

  templateNameExists = templateName => {
    let exists = false;
    for (let i = 0; i < this.state.templateNames.length; i++) {
      if (templateName === this.state.templateNames[i].templatename) {
        //Note templatename was not camel case in the server, decided to just leave as is here.
        exists = true;
      }
    }
    return exists;
  };

  toggleActivity = event => {
    const { allActivities, chosenActivities } = this.state;
    let i = 0;
    let tempArray = [...chosenActivities];
    //Find the activity associated with the checkbox.
    while (allActivities[i].name != event.target.name) {
      i++;
    }
    //See if activity is checked or not.
    let index = chosenActivities.indexOf(allActivities[i]);
    //Add if not found.
    if (index === -1) {
      tempArray.push(allActivities[i]);
    }
    //Splice out if found.
    else {
      tempArray.splice(index, 1);
    }
    this.setState({ chosenActivities: tempArray });
  };

  toggleErrorText = () => {
    if (this.state.errorText === "") {
      this.setState({
        errorText: "Template Name already in use. Please try again."
      });
    } else {
      this.setState({ errorText: "" });
    }
  };

  getImage = () => {
    switch (this.state.activeStep) {
      case 0:
        return forSale;
      case 1:
        return admin;
      case 2:
        return relax;
    }
  };

  getBlurb1 = () => {
    switch (this.state.activeStep) {
      case 0:
        return "First, we'll select some ";
      case 1:
        return "Next we'll set aside some ";
      case 2:
        return "Now you can set aside some ";
    }
  };
  getColor = () => {
    switch (this.state.activeStep) {
      case 0:
        return "green";
      case 1:
        return "GoldenRod";
      case 2:
        return "Red";
    }
  };
  getTime = () => {
    switch (this.state.activeStep) {
      case 0:
        return "Green";
      case 1:
        return "Yellow";
      case 2:
        return "Red";
    }
  };
  getBlurb2 = () => {
    switch (this.state.activeStep) {
      case 0:
        return ", or money making activities to track. These activities are your primary lead and eventually, transaction generators.";
      case 1:
        return ", or administrative time where you can practice skills, conduct research, or try to passively generate leads through marketing strategies.";
      case 2:
        return ", or time spent off from work.  When you are self employed taking time off can be hard but balance is important, so make sure you have enough of these activities in your schedule.";
    }
  };
  //Edit or add names of steps here
  getSteps() {
    return ["Lead Creation", "Administration", "Time Off", "Allocation"];
  }

  render() {
    const {
      activeStep,
      allActivities,
      chosenActivities,
      isSaveModalOpen,
      errorText,
      conversionRates,
      userPlan
    } = this.state;
    const blurbPt1 = this.getBlurb1();
    const blurbPt2 = this.getBlurb2();
    const color = this.getColor();
    const time = this.getTime();
    const image = this.getImage();
    const steps = this.getSteps();

    return (
      <div className="app-wrapper">
        <Paper className="jr-card">
          {window.outerWidth > 600 ? (
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              style={{ width: "95%", margin: "0 auto" }}
            >
              {steps.map(label => {
                return (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          ) : (
            <div className="mobileStepper">
              <MobileStepper
                activeStep={activeStep}
                steps={steps.length}
                position="static"
              />
            </div>
          )}
          {activeStep < 3 ? (
            <ActivityPicker
              step={activeStep + 2} //Selects the correct activities from the array based on the system's assigned category numbers.
              color={color}
              image={image}
              blurbPt1={blurbPt1}
              blurbPt2={blurbPt2}
              activities={allActivities}
              time={time}
              toggleActivity={this.toggleActivity}
              chosenActivities={chosenActivities}
            />
          ) : (
            <FinalAllocationPage
              chosenActivities={chosenActivities}
              conversionRates={conversionRates}
              userPlan={userPlan}
            />
          )}
          <div className="bottomBar">
            <Button variant="contained" color="default" onClick={this.backStep}>
              Back
            </Button>

            {activeStep < 3 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={this.advanceStep}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleDialogToggle}
              >
                Save Allocation
              </Button>
            )}
            <Dialog open={isSaveModalOpen} onClose={this.handleClose}>
              <DialogTitle>Confirmation & Save</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Save your allocation and we'll use it later to help create
                  your weekly calendar as well as give you some metric feedback
                  once you start inputing leads and making sales.
                </DialogContentText>
                {/* HERE IS WHERE WE ADD IN A CHART AND METRICS ON THIS ALLOCATION */}
                <TextField
                  autoFocus
                  margin="normal"
                  label="Allocation Name"
                  type="text"
                  fullWidth
                  name="templateName"
                  value={this.state.templateName}
                  onChange={this.handleInputChange}
                />
                <FormHelperText style={{ color: "red" }}>
                  {errorText}
                </FormHelperText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleDialogToggle} color="default">
                  Cancel
                </Button>
                <Button onClick={this.handleTemplateSave} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps({ currentUser }) {
  const { userId, name, lastName } = currentUser;
  return {
    userId,
    name,
    lastName
  };
}

export default connect(
  mapStateToProps,
  null
)(ActivityAllocationPage);
