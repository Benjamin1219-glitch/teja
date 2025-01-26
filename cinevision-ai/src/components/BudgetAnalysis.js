import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const BudgetAnalysis = ({ scriptContent }) => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeBudget = async () => {
      if (!scriptContent) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:3001/api/analyze/budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scriptText: scriptContent }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze budget');
        }

        const data = await response.json();
        setBudget(data);
      } catch (err) {
        setError('Error analyzing budget: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeBudget();
  }, [scriptContent]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <Typography>Analyzing budget...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">{error}</Typography>
    );
  }

  if (!budget) {
    return (
      <Typography>No budget analysis available.</Typography>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AttachMoneyIcon sx={{ fontSize: 40, color: '#3498db' }} />
        <Box>
          <Typography variant="h6">Total Estimated Budget</Typography>
          <Typography variant="h4" sx={{ color: '#3498db' }}>
            {formatCurrency(budget.total)}
          </Typography>
        </Box>
      </Box>

      {Object.entries(budget).map(([category, data]) => {
        if (category === 'total') return null;

        return (
          <Accordion 
            key={category}
            sx={{
              mb: 1,
              bgcolor: 'rgba(52, 152, 219, 0.1)',
              color: 'white',
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              sx={{ '&:hover': { bgcolor: 'rgba(52, 152, 219, 0.2)' } }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                <Typography sx={{ textTransform: 'capitalize' }}>
                  {category.replace('_', ' ')}
                </Typography>
                <Typography>
                  {formatCurrency(data.total)}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Item</TableCell>
                      {data.details[0]?.days && (
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Days</TableCell>
                      )}
                      {data.details[0]?.cost_per_day ? (
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Cost/Day</TableCell>
                      ) : (
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Cost</TableCell>
                      )}
                      {data.details[0]?.days && (
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Total</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.details.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          {item.name || item.character}
                        </TableCell>
                        {item.days && (
                          <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {item.days}
                          </TableCell>
                        )}
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          {formatCurrency(item.cost_per_day || item.cost)}
                        </TableCell>
                        {item.days && (
                          <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {formatCurrency((item.cost_per_day || item.cost) * item.days)}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default BudgetAnalysis;
