import PropTypes from "prop-types";
import qs from "query-string";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import reactStringReplace from "react-string-replace";

const Highlight = styled.mark`
    background-color: yellow;
`;

class Searchable extends Component {
    componentDidMount() {
        if (this.highlight) {
            this.highlight.scrollIntoView();
        }
    }
    highlightTextInChildren = (children, search) => {
        return React.Children.map(children, child => {
            if (typeof child === "string") {
                const result = reactStringReplace(child, search, (match, i) => {
                    return (
                        <Highlight
                            ref={node => {
                                if (!this.highlight) {
                                    this.highlight = node;
                                }
                            }}
                            key={i}
                        >
                            {match}
                        </Highlight>
                    );
                });
                return result;
            }
            if (child.props.children) {
                return React.cloneElement(child, {
                    children: this.highlightTextInChildren(
                        child.props.children,
                        search
                    )
                });
            }

            return child;
        });
    };

    render() {
        const { children, history } = this.props;
        const search = qs.parse(history.location.search).search;

        if (search) {
            return this.highlightTextInChildren(children, search);
        }
        return <div>{children}</div>;
    }
}

Searchable.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(Searchable);
