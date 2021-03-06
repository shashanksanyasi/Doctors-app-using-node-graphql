import gql from "graphql-tag";

const getAppointments = gql`
  query appointments {
    appointments {
      dateAndTime
      endDateAndTime
      user {
        email
        name
        phone
      }
    }
  }
`;
export default getAppointments;
