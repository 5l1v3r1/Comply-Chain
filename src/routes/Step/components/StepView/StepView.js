import PropTypes from "prop-types";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AccordionView from "../../../../components/AccordionView";
import Button from "../../../../components/Button";
import Icons from "../../../../components/Icons";
import { withLanguageContext } from "../../../../components/Language";
import FurtherResources from "../FurtherResources/FurtherResources";
import KeyTermList from "../KeyTermList";
import LearningObjectiveList from "../LearningObjectiveList";
import TopicsList from "../TopicList";
import styled from "styled-components";

const StepNavButtonGroup = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
`;

const HeaderIcon = styled.span`
    vertical-align: middle;
    padding-right: 10px;
`;
class StepView extends Component {
    constructor(props) {
        super(props);
        const { step, localizor } = this.props;

        const stepData = localizor.strings.steps[step - 1];
        const prevStep =
            (localizor.strings.steps[step - 2] && step - 1) || null;
        const nextStep = (localizor.strings.steps[step] && step + 1) || null;
        if (stepData) {
            const topics = stepData.topics;
            const learningObjectives = stepData.learningObjectives;
            const keyTerms = stepData.keyTerms;
            const Resources = stepData.furtherResources;
            const Training = stepData.training;
            this.state = {
                data: {
                    resources: {
                        title: localizor.strings.general.furtherResources,
                        content: Resources && (
                            <FurtherResources>
                                <Resources />
                            </FurtherResources>
                        ),
                        id: "resources"
                    },
                    learningObjectives: {
                        title: localizor.strings.general.learningObjectives,
                        content: (
                            <LearningObjectiveList
                                objectives={learningObjectives}
                            />
                        ),
                        id: "learning-objectives"
                    },
                    keyTerms: {
                        title: localizor.strings.general.keyTerms,
                        content: <KeyTermList terms={keyTerms} />,
                        id: "key-terms"
                    },
                    topics: {
                        title: localizor.strings.general.topics,
                        content: (
                            <TopicsList step={Number(step)} topics={topics} />
                        ),
                        id: "topics"
                    },
                    training: {
                        title: localizor.strings.general.training,
                        content: Training && <Training />,
                        id: "training"
                    }
                },
                nextStep: nextStep && `/steps/${nextStep}`,
                prevStep: prevStep && `/steps/${prevStep}`,
                title: stepData.title
            };
        }
    }

    navigate = path => {
        const { history } = this.props;
        history.push(path);
    };

    render() {
        const { localizor, pdf, step } = this.props;
        const {
            nextStep,
            prevStep,
            data,
            data: { learningObjectives, keyTerms, topics, resources, training },
            title
        } = this.state;
        if (!data) {
            return <div>Step not found!</div>;
        }
        const sections = [learningObjectives, keyTerms, topics];
        if (resources.content) {
            sections.push(resources);
        }
        if (training.content) {
            sections.push(training);
        }
        return (
            <div>
                <h3>
                    <HeaderIcon>
                        <Icons.StepIcon step={step} />
                    </HeaderIcon>
                    {title}
                </h3>
                <AccordionView
                    id="step-accordions"
                    sections={sections}
                    pdf={pdf}
                />
                <StepNavButtonGroup>
                    {prevStep && (
                        <Button
                            id="prev-step"
                            variant="primaryDarkest"
                            onClick={() => this.navigate(prevStep)}
                        >
                            <Icons.ArrowDropLeft />
                            {localizor.strings.general.prevStep}
                        </Button>
                    )}
                    {nextStep && (
                        <Button
                            id="next-step"
                            variant="primary"
                            onClick={() => this.navigate(nextStep)}
                        >
                            {localizor.strings.general.nextStep}
                            <Icons.ArrowDropRight />
                        </Button>
                    )}
                </StepNavButtonGroup>
            </div>
        );
    }
}

StepView.propTypes = {
    localizor: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    step: PropTypes.number.isRequired,
    pdf: PropTypes.bool
};

export default withRouter(withLanguageContext(StepView));
