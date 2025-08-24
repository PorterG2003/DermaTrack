// Define the structure for each onboarding section
export const ONBOARDING_SECTIONS = [
  {
    id: 'hormonal',
    title: 'Hormonal & Medical Context',
    description: 'Understanding your hormonal patterns and medical history',
    questions: [
      {
        id: 'sexAtBirth',
        question: 'What sex were you assigned at birth?',
        explanation: 'The biological sex assigned at birth based on physical characteristics.',
        type: 'singleChoice',
        options: ['female', 'male'],
        displayValues: {
          'female': 'Female',
          'male': 'Male'
        }
      },
      {
        id: 'menstruates',
        question: 'Do you currently have menstrual cycles?',
        explanation: 'Regular monthly menstrual cycles.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        },
        conditional: { dependsOn: 'sexAtBirth', value: 'female' }
      },
      {
        id: 'cycleRegular',
        question: 'Are your cycles usually regular (roughly every 21–35 days)?',
        explanation: 'Consistent cycle length between 21-35 days.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_applicable'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_applicable': 'Not applicable'
        },
        conditional: { dependsOn: 'menstruates', value: true }
      },
      {
        id: 'preMenstrualFlareDays',
        question: 'If you notice breakouts around your period, how many days before it do they usually start?',
        explanation: 'Hormonal acne that typically occurs in the premenstrual phase.',
        type: 'singleChoice',
        options: ['none', '1', '2', '3', '4_5', 'not_sure'],
        displayValues: {
          'none': 'I don\'t notice this',
          '1': '1 day',
          '2': '2 days',
          '3': '3 days',
          '4_5': '4-5 days',
          'not_sure': 'Not sure'
        },
        conditional: { dependsOn: 'menstruates', value: true }
      },
      {
        id: 'contraception',
        question: 'Are you using any birth control right now?',
        explanation: 'Current use of hormonal or non-hormonal contraception methods.',
        type: 'singleChoice',
        options: ['none', 'combined_pill', 'progestin_only', 'hormonal_iud', 'copper_iud', 'implant', 'ring', 'patch', 'other', 'prefer_not_to_say'],
        displayValues: {
          'none': 'None',
          'combined_pill': 'Combined pill',
          'progestin_only': 'Progestin-only pill',
          'hormonal_iud': 'Hormonal IUD',
          'copper_iud': 'Copper IUD',
          'implant': 'Implant',
          'ring': 'Vaginal ring',
          'patch': 'Patch',
          'other': 'Other',
          'prefer_not_to_say': 'Prefer not to say'
        },
        conditional: { dependsOn: 'sexAtBirth', value: 'female' }
      },
      {
        id: 'pregnancyStatus',
        question: 'Are you currently pregnant, postpartum, or breastfeeding?',
        explanation: 'Pregnancy, postpartum recovery, or breastfeeding can significantly impact skin condition.',
        type: 'singleChoice',
        options: ['no', 'pregnant', 'postpartum', 'breastfeeding'],
        displayValues: {
          'no': 'No',
          'pregnant': 'Pregnant',
          'postpartum': 'Postpartum',
          'breastfeeding': 'Breastfeeding'
        },
        conditional: { dependsOn: 'sexAtBirth', value: 'female' }
      },
      {
        id: 'pcosDiagnosed',
        question: 'Have you been diagnosed with PCOS?',
        explanation: 'Polycystic ovary syndrome diagnosis, which can cause hormonal acne.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        },
        conditional: { dependsOn: 'sexAtBirth', value: 'female' }
      },
      {
        id: 'familyHistoryAcne',
        question: 'Did a close family member have significant acne?',
        explanation: 'Genetic predisposition from immediate family members with significant acne.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      }
    ]
  },
  {
    id: 'symptoms',
    title: 'Symptom Patterns',
    description: 'Mapping where and how your breakouts appear',
    questions: [
      {
        id: 'areasAffected',
        question: 'Where are your breakouts right now?',
        explanation: 'Select all areas where you currently have active breakouts.',
        type: 'multiChoice',
        options: ['forehead', 'hairline', 'temples', 'cheeks', 'jawline', 'chin', 'neck', 'chest', 'back', 'shoulders'],
        displayValues: {
          'forehead': 'Forehead',
          'hairline': 'Hairline',
          'temples': 'Temples',
          'cheeks': 'Cheeks',
          'jawline': 'Jawline',
          'chin': 'Chin',
          'neck': 'Neck',
          'chest': 'Chest',
          'back': 'Back',
          'shoulders': 'Shoulders'
        }
      },
      {
        id: 'itchy',
        question: 'Do your breakouts itch?',
        explanation: 'Pruritic sensation associated with breakouts.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      },
      {
        id: 'allBumpsLookSame',
        question: 'Do most bumps look about the same size and shape?',
        explanation: 'Consistent lesion morphology helps determine acne type.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      },
      {
        id: 'comedonesPresent',
        question: 'Do you see blackheads or whiteheads?',
        explanation: 'Open comedones (blackheads) or closed comedones (whiteheads).',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      }
    ]
  },
  {
    id: 'skinBehavior',
    title: 'Skin Behavior',
    description: 'How your skin responds to different conditions',
    questions: [
      {
        id: 'middayShineTzone',
        question: 'By midday, does your forehead/nose feel shiny or oily?',
        explanation: 'Sebum production in the T-zone (forehead, nose, chin).',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      },
      {
        id: 'middayShineCheeks',
        question: 'By midday, do your cheeks feel shiny or oily?',
        explanation: 'Sebum production in the cheek area.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      },
      {
        id: 'feelsTightAfterCleanse',
        question: 'Does your face feel tight right after washing?',
        explanation: 'Sensation of skin tightness post-cleansing.',
        type: 'singleChoice',
        options: ['yes', 'no', 'sometimes'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'sometimes': 'Sometimes'
        }
      },
      {
        id: 'visibleFlakingDaysPerWeek',
        question: 'How many days per week do you notice visible flaking?',
        explanation: 'Visible skin desquamation frequency.',
        type: 'singleChoice',
        options: ['0', '1_2', '3_4', '5_7'],
        displayValues: {
          '0': '0 days',
          '1_2': '1-2 days',
          '3_4': '3-4 days',
          '5_7': '5-7 days'
        }
      },
      {
        id: 'blottingSheetsPerDay',
        question: 'On a typical day, how many oil-blotting sheets would you use?',
        explanation: 'Daily oil absorption sheet usage.',
        type: 'singleChoice',
        options: ['0', '1', '2', '3_plus'],
        displayValues: {
          '0': '0',
          '1': '1',
          '2': '2',
          '3_plus': '3+'
        }
      },
      {
        id: 'moisturizerReapplyPerDay',
        question: 'How many times a day do you reapply moisturizer (if any)?',
        explanation: 'Frequency of moisturizer reapplication.',
        type: 'singleChoice',
        options: ['0', '1', '2', '3_plus'],
        displayValues: {
          '0': '0',
          '1': '1',
          '2': '2',
          '3_plus': '3+'
        }
      },
      {
        id: 'stingsWithBasicMoisturizer',
        question: 'Does a basic fragrance-free moisturizer sting or burn?',
        explanation: 'Sensory irritation from basic moisturizer application.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      },
      {
        id: 'historyOfEczemaOrDermatitis',
        question: 'Have you ever been told you have eczema or dermatitis?',
        explanation: 'History of inflammatory skin conditions.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      }
    ]
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Factors',
    description: 'Daily habits that affect your skin',
    questions: [
      {
        id: 'maskHoursPerDay',
        question: 'On a typical day, how many hours do you wear a mask?',
        explanation: 'Daily duration of facial mask usage.',
        type: 'singleChoice',
        options: ['0', '1_2', '3_4', '5_plus'],
        displayValues: {
          '0': '0 hours',
          '1_2': '1-2 hours',
          '3_4': '3-4 hours',
          '5_plus': '5+ hours'
        }
      },
      {
        id: 'helmetHoursPerWeek',
        question: 'How many hours per week do you wear a helmet?',
        explanation: 'Weekly duration of protective headgear usage.',
        type: 'singleChoice',
        options: ['0', '1_3', '4_7', '8_plus'],
        displayValues: {
          '0': '0 hours',
          '1_3': '1-3 hours',
          '4_7': '4-7 hours',
          '8_plus': '8+ hours'
        }
      },
      {
        id: 'chinstrapOrGearHoursPerWeek',
        question: 'How many hours per week do you wear a chinstrap or other tight face gear?',
        explanation: 'Weekly duration of tight facial gear usage.',
        type: 'singleChoice',
        options: ['0', '1_3', '4_7', '8_plus'],
        displayValues: {
          '0': '0 hours',
          '1_3': '1-3 hours',
          '4_7': '4-7 hours',
          '8_plus': '8+ hours'
        }
      },
      {
        id: 'sweatyWorkoutsPerWeek',
        question: 'How many sweaty workouts do you do per week?',
        explanation: 'Weekly frequency of high-intensity exercise sessions.',
        type: 'singleChoice',
        options: ['0', '1_2', '3_4', '5_plus'],
        displayValues: {
          '0': '0',
          '1_2': '1-2',
          '3_4': '3-4',
          '5_plus': '5+'
        }
      },
      {
        id: 'showerSoonAfterSweat',
        question: 'Do you usually wash or shower within 30 minutes after sweating?',
        explanation: 'Post-exercise hygiene timing.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      }
    ]
  },
  {
    id: 'diet',
    title: 'Diet & Nutrition',
    description: 'Food and drink patterns',
    questions: [
      {
        id: 'sugaryDrinksPerDay',
        question: 'On average, how many sugary drinks do you have per day?',
        explanation: 'Daily consumption of sweetened beverages.',
        type: 'singleChoice',
        options: ['0', '1', '2', '3_plus'],
        displayValues: {
          '0': '0',
          '1': '1',
          '2': '2',
          '3_plus': '3+'
        }
      },
      {
        id: 'whiteCarbServingsPerDay',
        question: 'How many servings of white carbs do you have per day?',
        explanation: 'Daily consumption of refined carbohydrates.',
        type: 'singleChoice',
        options: ['0', '1', '2', '3_plus'],
        displayValues: {
          '0': '0',
          '1': '1',
          '2': '2',
          '3_plus': '3+'
        }
      },
      {
        id: 'dairyServingsPerDay',
        question: 'How many servings of cow\'s milk/dairy do you have per day?',
        explanation: 'Daily consumption of cow\'s milk products.',
        type: 'singleChoice',
        options: ['0', '1', '2', '3_plus'],
        displayValues: {
          '0': '0',
          '1': '1',
          '2': '2',
          '3_plus': '3+'
        }
      },
      {
        id: 'mostlySkimDairy',
        question: 'If you drink milk, is it mostly skim or low-fat?',
        explanation: 'Preference for low-fat dairy options.',
        type: 'singleChoice',
        options: ['yes', 'no', 'i_dont_drink_milk'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'i_dont_drink_milk': 'I don\'t drink milk'
        }
      },
      {
        id: 'wheyProteinUse',
        question: 'Do you use whey protein?',
        explanation: 'Current whey protein supplementation.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      }
    ]
  },
  {
    id: 'medications',
    title: 'Medications & Supplements',
    description: 'Current medications that may affect your skin',
    questions: [
      {
        id: 'hasPotentialMedTrigger',
        question: 'Are you currently taking any of these: corticosteroids, testosterone, lithium, isoniazid, phenytoin, EGFR inhibitors, or high-dose B12?',
        explanation: 'Medications known to potentially trigger acne.',
        type: 'singleChoice',
        options: [true, false, 'not_sure'],
        displayValues: {
          true: 'Yes',
          false: 'No',
          'not_sure': 'Not sure'
        }
      }
    ]
  },
  {
    id: 'products',
    title: 'Routine Products',
    description: 'Products you use on your face and hair',
    questions: [
      {
        id: 'waterTemp',
        question: 'What water temperature do you usually use on your face?',
        explanation: 'Preferred facial cleansing water temperature.',
        type: 'singleChoice',
        options: ['cool', 'lukewarm', 'hot'],
        displayValues: {
          'cool': 'Cool',
          'lukewarm': 'Lukewarm',
          'hot': 'Hot'
        }
      },
      {
        id: 'cleansesPerDay',
        question: 'How many times a day do you wash your face?',
        explanation: 'Daily facial cleansing frequency.',
        type: 'singleChoice',
        options: ['0', '1', '2', '3_plus'],
        displayValues: {
          '0': '0',
          '1': '1',
          '2': '2',
          '3_plus': '3+'
        }
      },
      {
        id: 'usesScrubsOrBrushes',
        question: 'Do you use scrubs or cleansing brushes?',
        explanation: 'Use of mechanical exfoliation tools.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      },
      {
        id: 'fragranceInSkincare',
        question: 'Do any of your face products contain fragrance?',
        explanation: 'Presence of added fragrances in facial products.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      },
      {
        id: 'fragranceInHaircare',
        question: 'Do any of your hair products contain fragrance?',
        explanation: 'Presence of added fragrances in hair products.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      },
      {
        id: 'hairOilsOrPomades',
        question: 'Do you use hair oils or pomades/grease?',
        explanation: 'Use of hair styling and conditioning products.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      },
      {
        id: 'hairTouchesForehead',
        question: 'Does your hair regularly rest on your forehead?',
        explanation: 'Hair contact with forehead area.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      },
      {
        id: 'usesMoisturizerDaily',
        question: 'Do you apply moisturizer every day?',
        explanation: 'Daily moisturizer application routine.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      },
      {
        id: 'usesSunscreenDaily',
        question: 'Do you apply sunscreen every morning?',
        explanation: 'Daily morning sun protection routine.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      },
      {
        id: 'pillowcaseChangesPerWeek',
        question: 'How many times per week do you change your pillowcase?',
        explanation: 'Weekly pillowcase change frequency.',
        type: 'singleChoice',
        options: ['0', '1', '2', '3_plus'],
        displayValues: {
          '0': '0',
          '1': '1',
          '2': '2',
          '3_plus': '3+'
        }
      },
      {
        id: 'laundryDetergentFragranced',
        question: 'Is your laundry detergent or scent booster fragranced?',
        explanation: 'Presence of added fragrances in laundry products.',
        type: 'singleChoice',
        options: ['yes', 'no', 'not_sure'],
        displayValues: {
          'yes': 'Yes',
          'no': 'No',
          'not_sure': 'Not sure'
        }
      },
      {
        id: 'sleepWithLeaveInHairProducts',
        question: 'Do you sleep with leave-in hair products in?',
        explanation: 'Overnight retention of hair styling products.',
        type: 'singleChoice',
        options: [true, false],
        displayValues: {
          true: 'Yes',
          false: 'No'
        }
      }
    ]
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'Review and finish setup',
    questions: []
  }
] as const;

// Helper function to get display value for an option
export function getDisplayValue(questionId: string, option: any): string {
  const section = ONBOARDING_SECTIONS.find(section => 
    section.questions.some(q => q.id === questionId)
  );
  
  if (section) {
    const question = section.questions.find(q => q.id === questionId);
    if (question && question.displayValues) {
      return question.displayValues[option as keyof typeof question.displayValues] || String(option);
    }
  }
  
  return String(option);
}
