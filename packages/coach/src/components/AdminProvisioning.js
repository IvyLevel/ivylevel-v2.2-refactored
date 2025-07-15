// packages/coach/src/components/AdminProvisioning.js - Refactored for modularity
import React from 'react';
import { usePersona } from '@ivylevel/core/utils/hooks';  // From core

// Your original code here, refactored with props for extensions
const AdminProvisioning = (props) => {
  const { role } = usePersona(props.user);  // Scalable hook

  // Original wizard logic...
  return (
    <div>
      {/* Your existing UI */}
      <button onClick={() => props.onProvision()}>Provision Coach (CUJ 6)</button>
    </div>
  );
};

export default AdminProvisioning; 