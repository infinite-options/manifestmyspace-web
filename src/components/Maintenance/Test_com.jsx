import React from 'react';

const Test_com = ({ value }) => {
  console.log('ChildC rendered with value:', value); // Debug log
  return (
    <div>
      <p>The value in Child C is: {value}</p>
    </div>
  );
};

export default Test_com;
