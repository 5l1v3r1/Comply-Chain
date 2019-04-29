import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { theme } from "../../../modules/config/theme";
import { isBrowser } from "../../../modules/utils/platform";

class SideNav extends Component {
    state = {
        width: (isBrowser() && "280px") || "100%",
        visible: this.props.visible || false
    };

    componentWillMount() {
        if (window.PointerEvent) {
            document.addEventListener("pointerdown", this.close, false);
        } else {
            document.addEventListener("mousedown", this.close, false);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this.setState({ visible: this.props.visible });
        }
    }

    componentWillUnmount() {
        if (window.PointerEvent) {
            document.removeEventListener("pointerdown", this.close, false);
        } else {
            document.removeEventListener("mousedown", this.close, false);
        }
    }

    close = e => {
        if (
            this.node.contains(e.target) ||
            e.target.id === this.props.clickable
        ) {
            return;
        }
        const { onClose } = this.props;
        this.setState({ visible: false });
        if (onClose) {
            onClose();
        }
    };

    render() {
        const { width, visible } = this.state;
        const { children, id } = this.props;
        return (
            <RootSideNav
                id={id}
                width={width}
                visible={visible}
                ref={node => (this.node = node)}
            >
                <FlexContainer>
                    {React.Children.map(children, child => {
                        return child;
                    })}
                </FlexContainer>
            </RootSideNav>
        );
    }
}

const RootSideNav = styled.div`
    height: 100%;
    width: ${props => {
        if (props.visible) {
            return props.width;
        }
        return 0;
    }};
    position: fixed;
    z-index: 500;
    top: auto;
    left: 0;
    background-color: ${theme.colors.primary};
    overflow-x: hidden;
    transition: all 0.3s ease;
`;

const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;

    & > * {
        margin-bottom: 5px;
        flex-shrink: 0;
        min-width: 270px;
    }
`;

SideNav.Item = styled.div`
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    color: ${props =>
        props.dimmed ? theme.colors.grayLight : theme.colors.white};
    font-weight: bold;
    display: block;
    transition: 0.3s;
    border-bottom: 2px solid ${theme.colors.primaryDarker};
    cursor: pointer;

    &:hover {
        color: ${props =>
            props.dimmed ? theme.colors.gray : theme.colors.offWhite};
    }
`;

SideNav.Item.propTypes = {
    dimmed: PropTypes.oneOf([0, 1])
};

SideNav.IdentedItem = styled(SideNav.Item)`
    padding-left: 48px;
`;

SideNav.propTypes = {
    id: PropTypes.string,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.node,
    clickable: PropTypes.string
};

export default SideNav;
