import { FormTab } from "react-admin";
import { FormTabProps } from "ra-ui-materialui/lib/form/FormTab";
import { useActiveTab } from "./useActiveTab";
import PropTypes from "prop-types";
import { ReactElement } from "react";

export type LocationAwareFormTabProps = Omit<FormTabProps, "path"> & {
  renderIfNotVisible: boolean;
  path: string;
  children: ReactElement;
};

const LocationAwareFormTab = ({
  children,
  renderIfNotVisible,
  ...rest
}: LocationAwareFormTabProps) => {
  const activeTab = useActiveTab();
  return (
    <FormTab {...rest}>
      {activeTab === rest.path || renderIfNotVisible ? children : undefined}
    </FormTab>
  );
};

LocationAwareFormTab.propTypes = {
  ...FormTab.propTypes,
  path: PropTypes.string.isRequired,
  renderIfNotVisible: PropTypes.bool.isRequired,
};

LocationAwareFormTab.defaultProps = {
  renderIfNotVisible: true,
};

export default LocationAwareFormTab;
