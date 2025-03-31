const express = require('express');
const router = express.Router();
const companyData = require('../data/company.json');

function getCompanyBranches(companyName) {
  if (!companyData[companyName]) {
    return {
      success: false,
      message: `Company '${companyName}' not found`
    };
  }

  const branches = companyData[companyName].branch;
  return {
    success: true,
    data: Object.keys(branches).map(branchName => ({
      branchName,
      ...branches[branchName]
    }))
  };
}

function getSingleBranch(companyName, branchName) {
  const company = companyData[companyName];
  if (!company) {
    return {
      success: false,
      message: `Company '${companyName}' not found`
    };
  }

  const branch = company.branch[branchName];
  if (!branch) {
    return {
      success: false,
      message: `Branch '${branchName}' not found in company '${companyName}'`
    };
  }

  return {
    success: true,
    data: {
      branchName,
      ...branch
    }
  };
}

function getAllBranches() {
  const result = {};
  
  Object.keys(companyData).forEach(companyName => {
    result[companyName] = Object.keys(companyData[companyName].branch).map(branchName => ({
      branchName,
      ...companyData[companyName].branch[branchName]
    }));
  });

  return result;
}

router.get('/:companyName', (req, res) => {
  const result = getCompanyBranches(req.params.companyName);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.message });
  }
});

router.get('/:companyName/:branchName', (req, res) => {
  const result = getSingleBranch(req.params.companyName, req.params.branchName);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.message });
  }
});


router.get('/', (req, res) => {
  res.json(getAllBranches());
});

module.exports = router;