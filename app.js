/**
 * NOVEL BIOMARKERS - APPLE-INSPIRED INTERACTIVE SCIENTIFIC WEB APP
 * Comprehensive interactive controllers:
 * - Dynamic BMI & 2025 Lancet Clinical Obesity Simulator with Persona Toggles
 * - Interactive Leptin Pathway & Metreleptin Rescue Simulator (Farooqi 1999)
 * - ADA 2026 Interactive Diagnostic Evaluator
 * - BCAA Diabetes Risk Calculator & mTORC1 Pathway Explorer (Wang 2011)
 * - HbA1c Interference Detective
 * - 2026 ACC/AHA Lipoprotein(a) Risk Enhancer Tool
 * - ApoB vs LDL-C Discordance Visualizer
 * - Master Searchable Biomarker Compendium
 * - Interactive 10-Question Clinical Examination Quiz
 * - Sticky Scroll-Spy Navigation
 */

// -------------------------------------------------------------
// 1. BMI & 2025 LANCET CLINICAL OBESITY SIMULATOR
// -------------------------------------------------------------
function initBmiSimulator() {
    const heightSlider = document.getElementById('bmiHeightSlider');
    const weightSlider = document.getElementById('bmiWeightSlider');
    const organCheckboxes = document.querySelectorAll('.organ-damage-checkbox');
    const personaBtns = document.querySelectorAll('.persona-btn');

    if (!heightSlider || !weightSlider) return;

    heightSlider.addEventListener('input', updateBmiCalculations);
    weightSlider.addEventListener('input', updateBmiCalculations);

    organCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateBmiCalculations);
    });

    personaBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            personaBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyBmiPersona(e.target.dataset.persona);
        });
    });

    updateBmiCalculations();
}

function updateBmiCalculations() {
    const heightCm = parseFloat(document.getElementById('bmiHeightSlider').value);
    const weightKg = parseFloat(document.getElementById('bmiWeightSlider').value);

    document.getElementById('heightDisplayVal').innerText = `${heightCm} cm`;
    document.getElementById('weightDisplayVal').innerText = `${weightKg} kg`;

    const heightM = heightCm / 100.0;
    const bmi = weightKg / (heightM * heightM);
    const bmiFormatted = bmi.toFixed(1);

    document.getElementById('calculatedBmiVal').innerText = bmiFormatted;

    // WHO Anthropometric Category
    let whoCategory = '';
    let whoBadgeColor = '';
    if (bmi < 18.5) {
        whoCategory = 'Underweight (< 18.5)';
        whoBadgeColor = '#3B82F6';
    } else if (bmi < 25.0) {
        whoCategory = 'Normal Weight (18.5 – 24.9)';
        whoBadgeColor = '#10B981';
    } else if (bmi < 30.0) {
        whoCategory = 'Overweight (25.0 – 29.9)';
        whoBadgeColor = '#F59E0B';
    } else if (bmi < 35.0) {
        whoCategory = 'Class I Obesity (30.0 – 34.9)';
        whoBadgeColor = '#CC1E4A';
    } else if (bmi < 40.0) {
        whoCategory = 'Class II Obesity (35.0 – 39.9)';
        whoBadgeColor = '#991B1B';
    } else {
        whoCategory = 'Class III Severe Obesity (≥ 40.0)';
        whoBadgeColor = '#7F1D1D';
    }

    const whoElem = document.getElementById('whoBmiCategoryDisplay');
    whoElem.innerText = whoCategory;
    whoElem.style.color = whoBadgeColor;

    // Check active organ damage toggles
    const checkedDamage = Array.from(document.querySelectorAll('.organ-damage-checkbox:checked')).map(cb => cb.value);
    const hasOrganDamage = checkedDamage.length > 0;

    // 2025 Lancet Commission Classification
    const lancetElem = document.getElementById('lancetStagingDisplay');
    const lancetRationaleElem = document.getElementById('lancetRationaleDisplay');

    if (bmi < 25.0 && !hasOrganDamage) {
        lancetElem.innerText = 'Non-Obese / Normal Metabolic State';
        lancetElem.className = 'result-callout alert-success';
        lancetRationaleElem.innerText = 'Normal weight-for-height ratio with no detectable target-organ dysfunction. Maintain balanced nutrition and physical activity.';
    } else if (bmi >= 25.0 && !hasOrganDamage) {
        lancetElem.innerText = 'PRECLINICAL OBESITY (Lancet 2025 Framework)';
        lancetElem.className = 'result-callout alert-warning';
        lancetRationaleElem.innerHTML = `<strong>Excess Adiposity Present without Organ Damage:</strong> The patient has elevated BMI (${bmiFormatted}), but all target tissues currently maintain normal function. Represents a crucial window for primary lifestyle intervention before clinical disease develops.`;
    } else if (hasOrganDamage && bmi >= 25.0) {
        lancetElem.innerText = 'CLINICAL OBESITY (Lancet 2025 Organ Disease)';
        lancetElem.className = 'result-callout';
        lancetRationaleElem.innerHTML = `<strong>Adiposity with Active End-Organ Damage:</strong> Excess fat mass has caused structural, metabolic, or functional tissue impairment (${checkedDamage.join(', ')}). Diagnosed as an active clinical disease requiring intensive medical/pharmacological therapy!`;
    } else if (hasOrganDamage && bmi < 25.0) {
        lancetElem.innerText = 'METABOLICALLY UNHEALTHY NORMAL WEIGHT (Normal BMI with Organ Disease)';
        lancetElem.className = 'result-callout';
        lancetRationaleElem.innerHTML = `<strong>The Sarcopenic/Visceral Trap:</strong> Despite a "normal" BMI (${bmiFormatted}), the patient suffers from active metabolic dysfunction (${checkedDamage.join(', ')}). Illustrates why BMI fails as a single diagnostic marker!`;
    }
}

function applyBmiPersona(personaKey) {
    const heightSlider = document.getElementById('bmiHeightSlider');
    const weightSlider = document.getElementById('bmiWeightSlider');
    const cbs = document.querySelectorAll('.organ-damage-checkbox');

    // Uncheck all initially
    cbs.forEach(cb => cb.checked = false);

    if (personaKey === 'athlete') {
        heightSlider.value = 188;
        weightSlider.value = 112; // BMI ~ 31.7
        // No organ damage
    } else if (personaKey === 'sarcopenic') {
        heightSlider.value = 165;
        weightSlider.value = 63;  // BMI ~ 23.1 (Normal BMI)
        document.getElementById('dmg_insulin').checked = true;
        document.getElementById('dmg_masld').checked = true;
    } else if (personaKey === 'clinical') {
        heightSlider.value = 172;
        weightSlider.value = 104; // BMI ~ 35.2
        document.getElementById('dmg_insulin').checked = true;
        document.getElementById('dmg_masld').checked = true;
        document.getElementById('dmg_htn').checked = true;
    }

    updateBmiCalculations();
}

// -------------------------------------------------------------
// 2. LEPTIN SPECTRUM & METRELEPTIN RESCUE SIMULATOR (FAROOQI 1999)
// -------------------------------------------------------------
function initLeptinSimulator() {
    const stateToggles = document.querySelectorAll('.leptin-state-toggle');
    const fatSlider = document.getElementById('leptinFatSlider');
    const metreleptinBtn = document.getElementById('btnInjectMetreleptin');

    if (!fatSlider) return;

    fatSlider.addEventListener('input', updateLeptinSimulation);

    stateToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            stateToggles.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            updateLeptinSimulation();
        });
    });

    if (metreleptinBtn) {
        metreleptinBtn.addEventListener('click', triggerMetreleptinRescue);
    }

    updateLeptinSimulation();
}

function updateLeptinSimulation() {
    const activeToggle = document.querySelector('.leptin-state-toggle.active');
    const state = activeToggle ? activeToggle.dataset.state : 'normal';
    const bodyFat = parseFloat(document.getElementById('leptinFatSlider').value);

    document.getElementById('leptinFatValDisplay').innerText = `${bodyFat}%`;

    const levelElem = document.getElementById('leptinLevelNumber');
    const satietyElem = document.getElementById('leptinSatietyStatus');
    const pathwayElem = document.getElementById('leptinPathwayBox');
    const metreleptinBtn = document.getElementById('btnInjectMetreleptin');

    if (metreleptinBtn) metreleptinBtn.style.display = 'none';

    if (state === 'normal') {
        const circulatingLeptin = Math.round(bodyFat * 0.45);
        levelElem.innerText = `${circulatingLeptin} ng/mL`;
        levelElem.style.color = '#10B981';
        satietyElem.innerText = 'Intact Hypothalamic Satiety Signaling';
        satietyElem.style.color = '#10B981';
        pathwayElem.className = 'result-callout alert-success';
        pathwayElem.innerHTML = `
            <strong>Normal Physiological Loop:</strong> Differentiated white adipocytes secrete leptin in proportion to fat mass. 
            Leptin crosses the BBB via saturable receptor transport -> binds LepRb in arcuate nucleus -> recruits JAK2/STAT3 -> 
            <strong>stimulates POMC/CART neurons</strong> (releasing alpha-MSH to activate MC4R) and <strong>inhibits NPY/AgRP neurons</strong>. Satiety is appropriately signaled!
        `;
    } else if (state === 'resistance') {
        const circulatingLeptin = Math.round(bodyFat * 1.85);
        levelElem.innerText = `${circulatingLeptin} ng/mL`;
        levelElem.style.color = 'var(--crimson)';
        satietyElem.innerText = 'LEPTIN RESISTANCE: Chronic Hunger & Impaired Satiety';
        satietyElem.style.color = 'var(--crimson)';
        pathwayElem.className = 'result-callout alert-warning';
        pathwayElem.innerHTML = `
            <strong>The Obesity Paradox:</strong> Expanded adipose tissue secretes massive amounts of leptin (${circulatingLeptin} ng/mL). 
            However, saturated BBB transport and intracellular induction of <strong>SOCS3 (Suppressor of Cytokine Signaling 3)</strong> 
            and <strong>PTP1B</strong> dephosphorylate JAK2, blocking downstream STAT3 activation. 
            The brain fails to register satiety and perceives <em>starvation</em> despite abundant adipose stores!
        `;
    } else if (state === 'deficiency') {
        levelElem.innerText = '0 ng/mL (Undetectable)';
        levelElem.style.color = 'var(--crimson)';
        satietyElem.innerText = 'Severe Intractable Hyperphagia (Farooqi et al. 1999 NEJM)';
        satietyElem.style.color = 'var(--crimson)';
        pathwayElem.className = 'result-callout';
        pathwayElem.innerHTML = `
            <strong>Congenital Monogenic Leptin Deficiency:</strong> Homozygous frameshift mutation in the <em>LEP</em> gene eliminates circulating leptin. 
            Without any inhibitory signal, orexigenic NPY/AgRP neurons fire continuously, driving relentless hunger and morbid early-onset obesity.
        `;
        if (metreleptinBtn) metreleptinBtn.style.display = 'inline-block';
    }
}

function triggerMetreleptinRescue() {
    const pathwayElem = document.getElementById('leptinPathwayBox');
    const levelElem = document.getElementById('leptinLevelNumber');
    const satietyElem = document.getElementById('leptinSatietyStatus');

    levelElem.innerText = '12 ng/mL (Therapeutic Metreleptin)';
    levelElem.style.color = 'var(--gold)';
    satietyElem.innerText = 'SATIETY RESTORED! Hyperphagia Normalized';
    satietyElem.style.color = '#10B981';

    pathwayElem.className = 'result-callout alert-success';
    pathwayElem.innerHTML = `
        <strong>Farooqi et al. (1999 NEJM) Metreleptin Treatment Effect:</strong> 
        Subcutaneous daily recombinant human leptin (metreleptin) activated previously dormant hypothalamic LepRb receptors. 
        Within days, extreme food-seeking behavior ceased, caloric intake fell by >80%, and the child achieved a sustained 
        <strong>16.4 kg fat-mass reduction over 12 months</strong>! Precision molecular rescue achieved.
    `;
}

// -------------------------------------------------------------
// 3. ADA 2026 INTERACTIVE DIAGNOSTIC EVALUATOR
// -------------------------------------------------------------
function initAdaEvaluator() {
    const fpgSlider = document.getElementById('adaFpgSlider');
    const a1cSlider = document.getElementById('adaA1cSlider');
    const ogttSlider = document.getElementById('adaOgttSlider');
    const symptomToggle = document.getElementById('adaSymptomToggle');

    if (!fpgSlider || !a1cSlider || !ogttSlider) return;

    fpgSlider.addEventListener('input', updateAdaEvaluation);
    a1cSlider.addEventListener('input', updateAdaEvaluation);
    ogttSlider.addEventListener('input', updateAdaEvaluation);
    if (symptomToggle) symptomToggle.addEventListener('change', updateAdaEvaluation);

    updateAdaEvaluation();
}

function updateAdaEvaluation() {
    const fpg = parseInt(document.getElementById('adaFpgSlider').value, 10);
    const a1c = parseFloat(document.getElementById('adaA1cSlider').value);
    const ogtt = parseInt(document.getElementById('adaOgttSlider').value, 10);
    const hasSymptoms = document.getElementById('adaSymptomToggle') ? document.getElementById('adaSymptomToggle').checked : false;

    document.getElementById('adaFpgVal').innerText = `${fpg} mg/dL`;
    document.getElementById('adaA1cVal').innerText = `${a1c.toFixed(1)}%`;
    document.getElementById('adaOgttVal').innerText = `${ogtt} mg/dL`;

    const verdictElem = document.getElementById('adaVerdictDisplay');
    const detailElem = document.getElementById('adaRuleDetailDisplay');

    const fpgDiabetic = (fpg >= 126);
    const a1cDiabetic = (a1c >= 6.5);
    const ogttDiabetic = (ogtt >= 200);

    const fpgPrediabetic = (fpg >= 100 && fpg <= 125);
    const a1cPrediabetic = (a1c >= 5.7 && a1c <= 6.4);
    const ogttPrediabetic = (ogtt >= 140 && ogtt <= 199);

    if (fpgDiabetic || a1cDiabetic || ogttDiabetic) {
        let criteriaMet = [];
        if (fpgDiabetic) criteriaMet.push(`FPG ≥ 126 (${fpg})`);
        if (a1cDiabetic) criteriaMet.push(`HbA1c ≥ 6.5% (${a1c}%)`);
        if (ogttDiabetic) criteriaMet.push(`2h-OGTT ≥ 200 (${ogtt})`);

        if (hasSymptoms) {
            verdictElem.innerText = 'PROVISIONAL/DEFINITIVE DIABETES MELLITUS (Classic Symptoms Present)';
            verdictElem.className = 'result-callout';
            detailElem.innerHTML = `<strong>2026 ADA Standards of Care:</strong> The patient exhibits diabetic threshold criteria (${criteriaMet.join(', ')}) in the presence of classic catabolic symptoms (polyuria, polydipsia, weight loss). Definitive clinical diagnosis can be made without mandatory repeat testing.`;
        } else {
            verdictElem.innerText = 'ABNORMAL TEST RESULT REQUIRING MANDATORY CONFIRMATION';
            verdictElem.className = 'result-callout alert-warning';
            detailElem.innerHTML = `<strong>2026 ADA Confirmatory Rule:</strong> The patient meets diabetic criteria (${criteriaMet.join(', ')}), but is <strong>ASYMPTOMATIC</strong>. The ADA mandates that a confirmatory repeat test (either FPG, HbA1c, or OGTT) be performed on a subsequent day (or two discordant tests from the same blood draw) before establishing an official clinical diagnosis.`;
        }
    } else if (fpgPrediabetic || a1cPrediabetic || ogttPrediabetic) {
        let preCriteria = [];
        if (fpgPrediabetic) preCriteria.push(`Impaired Fasting Glucose: ${fpg} mg/dL`);
        if (a1cPrediabetic) preCriteria.push(`Elevated Glycation: ${a1c}%`);
        if (ogttPrediabetic) preCriteria.push(`Impaired Glucose Tolerance: ${ogtt} mg/dL`);

        verdictElem.innerText = 'PRE-DIABETES / HIGH RISK FOR FUTURE DIABETES';
        verdictElem.className = 'result-callout alert-warning';
        detailElem.innerHTML = `<strong>Criteria Met:</strong> ${preCriteria.join('; ')}. Microvascular and endothelial stress are already accelerating. Recommended action: Intensive lifestyle modification, annual screening, and consideration of metformin (especially if BMI ≥ 35).`;
    } else {
        verdictElem.innerText = 'NORMAL GLYCEMIC PROFILE (All Parameters within Normal Range)';
        verdictElem.className = 'result-callout alert-success';
        detailElem.innerHTML = `FPG < 100 mg/dL, HbA1c < 5.7%, and 2h-OGTT < 140 mg/dL. Normal glucose homeostasis maintained. Repeat routine screening every 3 years.`;
    }
}

// -------------------------------------------------------------
// 4. BCAA DIABETES RISK CALCULATOR (WANG ET AL. 2011) & QUARTILE RANGES
// -------------------------------------------------------------
const bcaaQuartileData = [
    {
        qNum: 1,
        label: "Quartile 1 (Lowest 25%)",
        badge: "QUARTILE 1 (OPTIMAL BASELINE)",
        total: "< 350 μM",
        totalSub: "(typically 290–350 μM)",
        valine: "< 195 μM",
        leucine: "< 105 μM",
        isoleucine: "< 55 μM",
        hr: "1.00x",
        risk: "~2.1% 12-Year Conversion",
        badgeBg: "var(--bg-alt-light)",
        badgeColor: "var(--navy-dark)",
        badgeBorder: "var(--border-gray)",
        statusClass: "alert-success",
        pathway: "BCKD multienzyme complex normally decarboxylates BCAAs in skeletal muscle and adipose tissue. mTORC1 signaling remains physiological; IRS-1 serine phosphorylation is at baseline."
    },
    {
        qNum: 2,
        label: "Quartile 2 (25%–50%)",
        badge: "QUARTILE 2 (LOW-NORMAL)",
        total: "350–405 μM",
        totalSub: "",
        valine: "195–225 μM",
        leucine: "105–125 μM",
        isoleucine: "55–65 μM",
        hr: "1.84x",
        risk: "~3.9% 12-Year Conversion",
        badgeBg: "var(--bg-alt-light)",
        badgeColor: "var(--navy-dark)",
        badgeBorder: "var(--border-gray)",
        statusClass: "alert-success",
        pathway: "Mild down-regulation of adipose and skeletal muscle BCKD. Circulating BCAA concentrations begin subtle ascension, but cellular compensation prevents overt pathway blockade."
    },
    {
        qNum: 3,
        label: "Quartile 3 (50%–75%)",
        badge: "QUARTILE 3 (MODERATE ELEVATION)",
        total: "405–465 μM",
        totalSub: "",
        valine: "225–255 μM",
        leucine: "125–145 μM",
        isoleucine: "65–78 μM",
        hr: "2.95x",
        risk: "~6.2% 12-Year Conversion",
        badgeBg: "rgba(255, 201, 6, 0.2)",
        badgeColor: "var(--navy-dark)",
        badgeBorder: "var(--gold)",
        statusClass: "alert-warning",
        pathway: "Moderate BCKD enzymatic impairment. Rising Leucine concentrations begin to over-activate mTORC1 and downstream p70S6K1, initiating inhibitory IRS-1 Ser312 phosphorylation and early muscle insulin resistance."
    },
    {
        qNum: 4,
        label: "Quartile 4 (Highest 25%)",
        badge: "QUARTILE 4 (HIGH RISK / >5X HAZARD)",
        total: "> 465 μM",
        totalSub: "(typically 470–600+ μM)",
        valine: "> 255 μM",
        leucine: "> 145 μM",
        isoleucine: "> 78 μM",
        hr: "5.24x",
        risk: "~11.0% 12-Year Conversion (>5-Fold Higher!)",
        badgeBg: "var(--crimson)",
        badgeColor: "#FFFFFF",
        badgeBorder: "var(--crimson)",
        statusClass: "alert-crimson",
        pathway: "Impaired BCKD activity causes severe accumulation of Leucine, Isoleucine, and Valine. Excessive Leucine constitutively activates mTORC1/p70S6K1, triggering inhibitory phosphorylation of IRS-1 at Ser312/Ser636 and uncoupling insulin signaling from GLUT4 translocation!"
    }
];

function initBcaaCalculator() {
    const qRange = document.getElementById('bcaaWebSlider');
    if (qRange) {
        qRange.addEventListener('input', updateBcaaCalculation);
    }

    // Attach click handlers to Quartile Table rows
    const bcaaRows = document.querySelectorAll('.bcaa-row');
    bcaaRows.forEach(row => {
        row.addEventListener('click', () => {
            const qVal = parseInt(row.getAttribute('data-q'), 10);
            if (qRange && !isNaN(qVal)) {
                qRange.value = qVal;
                updateBcaaCalculation();
            }
        });
    });

    updateBcaaCalculation();
}

function updateBcaaCalculation() {
    const qRange = document.getElementById('bcaaWebSlider');
    if (!qRange) return;
    const q = parseInt(qRange.value, 10);
    const data = bcaaQuartileData[q - 1];
    if (!data) return;

    const qTextElem = document.getElementById('bcaaQText');
    if (qTextElem) qTextElem.innerText = data.label;

    const hrElem = document.getElementById('bcaaHrText');
    if (hrElem) hrElem.innerText = data.hr;

    const riskElem = document.getElementById('bcaaRiskText');
    if (riskElem) riskElem.innerText = data.risk;

    // Dynamic Concentration Ranges
    const totalElem = document.getElementById('bcaaTotalText');
    if (totalElem) {
        totalElem.innerHTML = `${data.total}${data.totalSub ? ` <span style="font-size: 10px; font-weight: normal; color: var(--text-muted); display: block;">${data.totalSub}</span>` : ''}`;
    }

    const valElem = document.getElementById('bcaaValText');
    if (valElem) valElem.innerText = data.valine;

    const leuElem = document.getElementById('bcaaLeuText');
    if (leuElem) leuElem.innerText = data.leucine;

    const ileElem = document.getElementById('bcaaIleText');
    if (ileElem) ileElem.innerText = data.isoleucine;

    const windowBadge = document.getElementById('bcaaWindowBadge');
    if (windowBadge) {
        windowBadge.innerText = data.badge;
        windowBadge.style.backgroundColor = data.badgeBg;
        windowBadge.style.color = data.badgeColor;
        windowBadge.style.borderColor = data.badgeBorder;
    }

    // Molecular Pathway Callout
    const pathwayElem = document.getElementById('bcaaPathwayDynamicText');
    if (pathwayElem) {
        pathwayElem.className = `result-callout ${data.statusClass}`;
        pathwayElem.innerText = data.pathway;
    }

    // Sync Active Table Row
    document.querySelectorAll('.bcaa-row').forEach(row => {
        const rowQ = parseInt(row.getAttribute('data-q'), 10);
        if (rowQ === q) {
            row.classList.add('active-row');
        } else {
            row.classList.remove('active-row');
        }
    });
}

// -------------------------------------------------------------
// 5. HbA1c INTERFERENCE DETECTIVE
// -------------------------------------------------------------
function initHba1cDetective() {
    const conditionBtns = document.querySelectorAll('.a1c-condition-btn');
    if (!conditionBtns.length) return;

    conditionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            conditionBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            explainHba1cInterference(e.target.dataset.condition);
        });
    });
}

function explainHba1cInterference(cond) {
    const box = document.getElementById('a1cDetectiveOutput');
    const explanations = {
        'hemolysis': {
            title: "Hemolytic Anemia / Spherocytosis / G6PD Deficiency",
            direction: "FALSELY LOW HbA1c",
            color: "var(--crimson)",
            mechanism: "Premature erythrocyte destruction significantly shortens average circulating RBC lifespan from ~120 days down to 30–60 days. Hemoglobin beta chains have far less ambient time to undergo non-enzymatic ketoamine glycation. Severe hyperglycemia will be dangerously masked as a 'normal' or 'low' HbA1c!",
            alternative: "Order Glycated Albumin (GA) or Continuous Glucose Monitoring (CGM)."
        },
        'iron': {
            title: "Iron Deficiency Anemia (Untreated)",
            direction: "FALSELY ELEVATED HbA1c",
            color: "var(--gold)",
            mechanism: "Impaired iron supply suppresses bone marrow erythropoiesis, decreasing the influx of newly synthesized, non-glycated reticulocytes. Consequently, older circulating erythrocytes persist longer in circulation, accumulating continuous glucose adduction and producing falsely elevated HbA1c in non-diabetic individuals.",
            alternative: "Evaluate Fasting Plasma Glucose (FPG) and 2h-OGTT; correct iron stores."
        },
        'hemoglobinopathy': {
            title: "Sickle Cell Trait (HbS) / Hemoglobin C (HbC)",
            direction: "ASSAY-DEPENDENT INTERFERENCE (Falsely High or Low)",
            color: "var(--crimson)",
            mechanism: "Structural amino acid substitutions in the hemoglobin beta chain (e.g. beta-6 Glu -> Val in HbS) cause abnormal chromatographic or electrophoretic co-elution in ion-exchange HPLC assays. Additionally, subclinical hemolysis shortens RBC survival.",
            alternative: "Utilize boronate affinity chromatography or immunoassay standardized to NGSP, or measure Glycated Albumin."
        },
        'pregnancy': {
            title: "Pregnancy (2nd & 3rd Trimester)",
            direction: "FALSELY LOW HbA1c",
            color: "var(--royal-blue)",
            mechanism: "Accelerated erythrocyte turnover, increased plasma volume expansion (dilution), and increased insulin sensitivity in early gestation followed by placental hormonal shifts reduce HbA1c reference intervals.",
            alternative: "Screen strictly with oral glucose tolerance test (OGTT) per standard gestational guidelines."
        },
        'hemodialysis': {
            title: "End-Stage Renal Disease on Hemodialysis",
            direction: "FALSELY LOW HbA1c",
            color: "var(--crimson)",
            mechanism: "Uremic chronic hemolysis, repeated mechanical blood loss during dialysis runs, and recombinant erythropoietin (EPO) administration flood the circulation with young reticulocytes, severely lowering HbA1c relative to ambient glycemia.",
            alternative: "Continuous Glucose Monitoring (TIR) or Glycated Albumin (GA)."
        }
    };

    const data = explanations[cond];
    box.innerHTML = `
        <div style="font-family: var(--font-heading); font-size: 18px; color: ${data.color}; margin-bottom: 4px;">${data.title}</div>
        <div style="font-weight: bold; font-size: 14px; color: var(--navy-dark); margin-bottom: 8px;">IMPACT: ${data.direction}</div>
        <p style="margin-bottom: 8px;"><strong>Biochemical Mechanism:</strong> ${data.mechanism}</p>
        <p style="font-size: 13px; color: var(--text-muted); font-style: italic;"><strong>Recommended Clinical Action:</strong> ${data.alternative}</p>
    `;
}

// -------------------------------------------------------------
// 6. 2026 ACC/AHA LIPOPROTEIN(a) RISK ENHANCER TOOL
// -------------------------------------------------------------
function initLpaWebTool() {
    const lpaSlider = document.getElementById('lpaWebSlider');
    if (!lpaSlider) return;

    lpaSlider.addEventListener('input', updateLpaWebCalculation);
    updateLpaWebCalculation();
}

function updateLpaWebCalculation() {
    const val = parseInt(document.getElementById('lpaWebSlider').value, 10);
    const approxMg = Math.round(val * 0.4);

    document.getElementById('lpaWebValDisplay').innerText = `${val} nmol/L (~${approxMg} mg/dL)`;

    const tierElem = document.getElementById('lpaWebTierDisplay');
    const guideElem = document.getElementById('lpaWebGuideDisplay');

    if (val < 75) {
        tierElem.innerText = "Optimal / Low Cardiovascular Risk Tier (< 75 nmol/L)";
        tierElem.className = "result-callout alert-success";
        guideElem.innerText = "Represents ~70% of the general population. Standard primary prevention lifestyle measures apply.";
    } else if (val < 125) {
        tierElem.innerText = "Intermediate / Borderline Tier (75 – 124 nmol/L)";
        tierElem.className = "result-callout alert-warning";
        guideElem.innerText = "Borderline elevation. Evaluate alongside family history of premature CAD, ApoB, and hs-CRP.";
    } else {
        tierElem.innerText = "HIGH-RISK ENHANCER TIER (≥ 125 nmol/L or ~50 mg/dL)";
        tierElem.className = "result-callout";
        guideElem.innerHTML = `
            <strong>2026 ACC/AHA Dyslipidemia Guideline Consensus:</strong> Lp(a) ≥ 125 nmol/L is an independent, 
            genetically determined cardiovascular risk-enhancing factor. Reclassifies patients to higher risk categories, 
            mandating intensive LDL-C reduction (statins, ezetimibe, PCSK9 inhibitors) and consideration for clinical trials with 
            novel RNA-targeting therapeutics (Pelacarsen, Olpasiran).
        `;
    }
}

// -------------------------------------------------------------
// 7. ApoB VS LDL-C DISCORDANCE SIMULATOR
// -------------------------------------------------------------
function initApobDiscordanceTool() {
    const ldlSlider = document.getElementById('apobLdlSlider');
    const tgSlider = document.getElementById('apobTgSlider');

    if (!ldlSlider || !tgSlider) return;

    ldlSlider.addEventListener('input', updateApobDiscordance);
    tgSlider.addEventListener('input', updateApobDiscordance);
    updateApobDiscordance();
}

function updateApobDiscordance() {
    const ldl = parseInt(document.getElementById('apobLdlSlider').value, 10);
    const tg = parseInt(document.getElementById('apobTgSlider').value, 10);

    document.getElementById('apobLdlVal').innerText = `${ldl} mg/dL`;
    document.getElementById('apobTgVal').innerText = `${tg} mg/dL`;

    // Estimate ApoB (mg/dL) based on LDL and small-dense particle shift driven by TG
    let apobEst = Math.round(ldl * 0.8 + (tg > 150 ? (tg - 150) * 0.15 : 0));
    document.getElementById('apobParticleCountVal').innerText = `${apobEst} mg/dL`;

    const statusBox = document.getElementById('apobStatusCallout');

    if (ldl < 100 && apobEst > 90) {
        statusBox.className = 'result-callout alert-warning';
        statusBox.innerHTML = `
            <strong>DISCORDANCE ALERT:</strong> LDL-C appears "normal" (${ldl} mg/dL), but ApoB is elevated (${apobEst} mg/dL)! 
            In patients with hypertriglyceridemia (${tg} mg/dL), LDL particles become small and dense, carrying less cholesterol mass per particle. 
            Because each atherogenic particle carries exactly <strong>ONE ApoB molecule</strong>, standard LDL-C severely underestimates true atherogenic particle count. 
            In all prospective trials, cardiovascular event risk strictly tracks ApoB!
        `;
    } else if (apobEst > 115) {
        statusBox.className = 'result-callout';
        statusBox.innerHTML = `
            <strong>High Atherogenic Particle Burden (ApoB ${apobEst} mg/dL):</strong> Substantial particle density accelerating subendothelial retention and plaque formation. ACC/AHA 2026 recommends intensive lipid-lowering therapy.
        `;
    } else {
        statusBox.className = 'result-callout alert-success';
        statusBox.innerHTML = `
            <strong>Concordant Profile:</strong> LDL-C (${ldl} mg/dL) and ApoB (${apobEst} mg/dL) are in relative biological alignment. Standard cardiovascular prevention guidelines apply.
        `;
    }
}

// -------------------------------------------------------------
// 8. MASTER BIOMARKER DATABASE SEARCH & FILTER
// -------------------------------------------------------------
const compendiumData = [
    { name: "Fasting Plasma Glucose (FPG)", domain: "Diabetes", type: "Traditional", class: "Metabolite (Hexose)", function: "Hepatic gluconeogenesis & baseline fasting glycemia", status: "ADA 2026 Diagnostic (≥126 mg/dL / 7.0 mmol/L)" },
    { name: "Glycated Hemoglobin (HbA1c)", domain: "Diabetes", type: "Traditional", class: "Glycated Protein", function: "120-day cumulative erythrocyte ketoamine glycation", status: "ADA 2026 Diagnostic (≥6.5% / 48 mmol/mol)" },
    { name: "2-Hour OGTT", domain: "Diabetes", type: "Traditional", class: "Challenge Test", function: "Peripheral muscle glucose disposal following 75g load", status: "ADA 2026 Diagnostic (≥200 mg/dL / 11.1 mmol/L)" },
    { name: "Branched-Chain Amino Acids (BCAAs)", domain: "Diabetes", type: "Novel", class: "Essential Amino Acids", function: "mTORC1 hyperactivation -> inhibitory IRS-1 Ser312 phosphorylation", status: "Investigational Predictor (>5x HR in Q4, Wang 2011)" },
    { name: "Circulating microRNA-126 (miR-126)", domain: "Diabetes", type: "Novel", class: "Non-Coding RNA (~22 nt)", function: "Endothelial SPRED1/PIK3R2 repression & VEGF signaling", status: "Research Liquid Biopsy (Loss marks vascular injury, Zampetaki 2010)" },
    { name: "Glycated Albumin (GA)", domain: "Diabetes", type: "Novel", class: "Glycated Serum Protein", function: "2–3 week intermediate glycemic window", status: "Specialized Clinical Use (Unaffected by RBC turnover)" },
    { name: "CGM Time-in-Range (TIR)", domain: "Diabetes", type: "Novel", class: "Sensor Metric", function: "% time interstitial glucose 70–180 mg/dL (target >70%)", status: "Established Management Tool (Insufficient for Diagnosis per ADA 2026)" },
    { name: "6-Protein Risk Signature (Xie 2025)", domain: "Diabetes", type: "Novel", class: "Multiplex Proteomics", function: "Pre-disease multi-organ metabolic/inflammatory risk", status: "Research Phase (+0.014 C-index gain in UK Biobank)" },
    { name: "Body Mass Index (BMI)", domain: "Obesity", type: "Traditional", class: "Anthropometric Ratio", function: "Population screening proxy for body mass", status: "Established Screening (Limited: misses body composition)" },
    { name: "Waist Circumference & WHR", domain: "Obesity", type: "Traditional", class: "Anthropometric Metric", function: "Central intra-abdominal visceral adiposity surrogate", status: "Established Risk-Enhancer in Cardiometabolic Screening" },
    { name: "Leptin", domain: "Obesity", type: "Novel", class: "16-kDa Peptide Hormone", function: "Hypothalamic LepRb satiety loop (POMC activation / AgRP inhibition)", status: "Elevated in Obesity (Resistance); Diagnostic in Congenital Deficiency (Farooqi 1999)" },
    { name: "Adiponectin", domain: "Obesity", type: "Novel", class: "30-kDa Adipokine", function: "Activates AdipoR1/R2, AMPK & PPAR-alpha; anti-inflammatory", status: "Research/Specialized (Paradoxically collapsed in obesity)" },
    { name: "Resistin", domain: "Obesity", type: "Novel", class: "12.5-kDa Cysteine-Rich Peptide", function: "Human monocyte inflammatory cytokine (TLR4/CAP1 -> NF-kB)", status: "Research Phase (Vascular inflammation)" },
    { name: "Fibroblast Growth Factor 21 (FGF21)", domain: "Obesity", type: "Novel", class: "Endocrine Metabolic Hormone", function: "beta-Klotho/FGFR1c brown fat thermogenesis & lipid clearance", status: "Research Phase (Elevated in metabolic stress)" },
    { name: "Growth Differentiation Factor 15 (GDF15)", domain: "Obesity", type: "Novel", class: "Stress-Induced Cytokine", function: "Hindbrain GFRAL receptor food-intake brake & nausea", status: "Research / Active Clinical Trial Drug Target" },
    { name: "Leptin-to-Adiponectin Ratio (L/A)", domain: "Obesity", type: "Novel", class: "Calculated Adipokine Ratio", function: "Integrated surrogate index of adipose tissue dysfunction", status: "Research Index (Sunita et al. 2026 Meta-Analysis)" },
    { name: "LDL Cholesterol (LDL-C)", domain: "CVD", type: "Traditional", class: "Lipoprotein Cholesterol Mass", function: "Atherogenic lipid carrier & plaque core component", status: "Primary Guideline Treatment Target (Statins, Ezetimibe, PCSK9)" },
    { name: "Cardiac Troponin (cTnI / cTnT)", domain: "CVD", type: "Traditional", class: "Contractile Sarcomere Protein", function: "Cardiomyocyte necrosis indicator", status: "Gold Standard Acute MI (NOT asymptomatic general screening)" },
    { name: "BNP / NT-proBNP", domain: "CVD", type: "Traditional", class: "Natriuretic Peptide", function: "Ventricular myocyte hemodynamic wall stress indicator", status: "Established Heart Failure Diagnosis & Prognosis" },
    { name: "High-Sensitivity CRP (hs-CRP)", domain: "CVD", type: "Traditional", class: "Acute-Phase Pentraxin", function: "Hepatic systemic inflammation response to IL-6", status: "Established Risk-Enhancer in Intermediate Risk" },
    { name: "Lipoprotein(a) [Lp(a)]", domain: "CVD", type: "Novel", class: "LDL Core + Apolipoprotein(a)", function: "Atherogenic, antifibrinolytic (plasminogen homology), carries OxPL", status: "2026 ACC/AHA Guideline: Universal Test ≥ 125 nmol/L (~50 mg/dL)" },
    { name: "Apolipoprotein B (ApoB)", domain: "CVD", type: "Novel", class: "Apolipoprotein (1:1 Particle Law)", function: "Quantifies total absolute atherogenic particle number", status: "Established; Strongly Endorsed by ACC/AHA for Discordance" },
    { name: "GlycA", domain: "CVD", type: "Novel", class: "NMR Glycoprotein Signal", function: "Captures chronic low-grade vascular bed inflammation", status: "Investigational on Specialized Clinical NMR Platforms" },
    { name: "Ceramides (CERT2 Score)", domain: "CVD", type: "Novel", class: "Bioactive Sphingolipids", function: "Endothelial eNOS uncoupling & fibrous cap destabilization", status: "Specialized Reference Labs (Mayo Clinic, Zora); Secondary Prevention" },
    { name: "CHIP Somatic Mutations", domain: "CVD", type: "Novel", class: "Somatic Stem Cell Mutation (TET2)", function: "Clonal expansion of hyper-inflammatory macrophages (IL-1beta/IL-6)", status: "Investigational via Deep Targeted NGS (~2x CAD Risk, Jaiswal 2017)" },
    { name: "Trimethylamine N-oxide (TMAO)", domain: "CVD", type: "Novel", class: "Gut Microbial Metabolite", function: "Upregulates CD36 foam cells & platelet hyperreactivity", status: "Investigational Research Marker (Tang et al. 2013)" },
    { name: "AI 9-Protein Panel (Huang 2026)", domain: "CVD", type: "Novel", class: "Machine Learning Proteomics", function: "Combinatorial CAD risk discrimination in UK Biobank", status: "Research Validation (+0.045 AUC gain to 0.762, Huang 2026 JAHA)" }
];

function initCompendiumSearch() {
    const input = document.getElementById('webCompendiumSearchInput');
    const filterBtns = document.querySelectorAll('.compendium-filter-pill');

    if (!input) return;

    input.addEventListener('input', renderCompendiumTable);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCompendiumTable();
        });
    });

    renderCompendiumTable();
}

function renderCompendiumTable() {
    const query = document.getElementById('webCompendiumSearchInput').value.toLowerCase();
    const activeFilter = document.querySelector('.compendium-filter-pill.active').dataset.filter;
    const tbody = document.getElementById('compendiumTableBody');

    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = compendiumData.filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(query) ||
                             item.class.toLowerCase().includes(query) ||
                             item.function.toLowerCase().includes(query) ||
                             item.status.toLowerCase().includes(query);

        let matchesFilter = true;
        if (activeFilter !== 'all') {
            matchesFilter = (item.domain.toLowerCase() === activeFilter) ||
                            (item.type.toLowerCase() === activeFilter);
        }
        return matchesQuery && matchesFilter;
    });

    filtered.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td><span class="section-badge badge-${item.domain.toLowerCase()}" style="font-size: 10px; margin-bottom: 0;">${item.domain.toUpperCase()}</span></td>
            <td>${item.class}</td>
            <td>${item.function}</td>
            <td><strong>${item.status}</strong></td>
        `;
        tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">No biomarkers match your search query.</td></tr>`;
    }
}

// -------------------------------------------------------------
// 9. INTERACTIVE 10-QUESTION CLINICAL EXAMINATION QUIZ
// -------------------------------------------------------------
const webQuizData = [
    {
        q: "1. An asymptomatic 46-year-old executive has an HbA1c of 7.1% on an executive health check. He also bought a direct-to-consumer metabolomic test showing elevated branched-chain amino acids (BCAAs). According to the 2026 ADA Standards of Care, what is the mandatory next step?",
        options: [
            "A. Diagnose Type 2 Diabetes immediately and initiate metformin therapy",
            "B. Confirm the diagnosis with a repeat test (FPG, HbA1c, or 2h-OGTT) on a subsequent day",
            "C. Diagnose Diabetes based on the BCAA elevation since it is a modern metabolomic marker",
            "D. Place the patient on Continuous Glucose Monitoring (CGM) to establish diagnosis"
        ],
        correct: 1,
        explanation: "Correct Answer: B. The 2026 ADA guidelines mandate that in an asymptomatic patient without unequivocal acute hyperglycemia, confirmatory repeat testing of standard criteria on a subsequent day is mandatory before diagnosis. BCAA profiles remain investigational risk predictors, not diagnostic criteria."
    },
    {
        q: "2. Why does severe untreated iron deficiency anemia cause a falsely ELEVATED HbA1c in non-diabetic patients?",
        options: [
            "A. Decreased iron directly activates glucose-binding receptors on hemoglobin",
            "B. Reticulocyte turnover is accelerated, leading to young erythrocytes",
            "C. Decreased bone marrow erythropoiesis prolongs circulating erythrocyte lifespan, allowing cumulative Amadori glycation over time",
            "D. Free serum iron normally degrades glycated hemoglobin in the spleen"
        ],
        correct: 2,
        explanation: "Correct Answer: C. In untreated iron deficiency anemia, reduced bone marrow erythropoiesis prolongs the circulatory lifespan of existing erythrocytes. Older RBCs remain in circulation longer, accumulating continuous non-enzymatic glycation and falsely elevating HbA1c."
    },
    {
        q: "3. In the Framingham Offspring Study (Wang et al. 2011 Nature Medicine), what was the multivariable-adjusted hazard ratio for incident T2D in the highest quartile of circulating BCAAs?",
        options: [
            "A. 1.25x increased risk",
            "B. 2.10x increased risk",
            "C. 5.24x increased risk (>5-fold higher risk)",
            "D. No statistically significant association after adjusting for BMI"
        ],
        correct: 2,
        explanation: "Correct Answer: C. Wang et al. (2011) demonstrated that baseline BCAA concentrations in the highest quartile conveyed a 5.24-fold higher risk (HR = 5.24, 95% CI: 2.10–13.11) of developing diabetes over 12 longitudinal years, completely independent of fasting glucose and BMI."
    },
    {
        q: "4. What is the downstream molecular mechanism by which excess circulating Leucine induces peripheral insulin resistance in skeletal muscle?",
        options: [
            "A. Directly cleaves insulin receptor tyrosine kinases",
            "B. Hyperactivates the mTORC1/p70S6K1 cascade, inducing inhibitory serine phosphorylation of IRS-1 at Ser312/Ser636",
            "C. Promotes rapid endocytosis and destruction of GLUT1 receptors in the brain",
            "D. Inhibits glucokinase transcription in pancreatic beta cells"
        ],
        correct: 1,
        explanation: "Correct Answer: B. Leucine hyperactivates mTORC1 through Rag GTPases. Downstream p70S6K1 directly phosphorylates IRS-1 on inhibitory serine residues (Ser312, Ser636), disrupting PI3-kinase docking and blunting insulin-stimulated GLUT4 vesicle translocation."
    },
    {
        q: "5. A common student misconception is that patients with common diet-induced obesity have leptin deficiency. What is the actual biological state in common obesity?",
        options: [
            "A. Satiety centers lack leptin receptors completely due to genomic deletion",
            "B. Circulating leptin is high (hyperleptinemia), but hypothalamic signaling is blunted due to receptor desensitization and intracellular SOCS3 induction (Leptin Resistance)",
            "C. Leptin is cleaved into inactive fragments by stomach acid before reaching the liver",
            "D. Serum leptin is strictly zero in all forms of adult obesity"
        ],
        correct: 1,
        explanation: "Correct Answer: B. Common obesity is characterized by severe hyperleptinemia accompanied by central leptin resistance (saturated blood-brain barrier transport and intracellular induction of SOCS3 terminating JAK2 phosphorylation). Congenital zero-leptin deficiency (Farooqi 1999) is an exceedingly rare monogenic condition."
    },
    {
        q: "6. According to the 2025 Lancet Diabetes & Endocrinology Commission, what defines 'Clinical Obesity' as opposed to 'Preclinical Obesity'?",
        options: [
            "A. A BMI strictly exceeding 40.0 kg/m²",
            "B. Excess adiposity accompanied by objective evidence of structural, metabolic, or functional tissue/organ impairment",
            "C. A waist-to-hip ratio greater than 1.2 in men",
            "D. Circulating leptin concentrations greater than 100 ng/mL"
        ],
        correct: 1,
        explanation: "Correct Answer: B. The 2025 Lancet Commission emphasizes that Clinical Obesity is an organ disease diagnosed by tissue damage (dyslipidemia, insulin resistance, MASLD, hypertension, sleep apnea) resulting from excess adiposity, rather than an arbitrary BMI cutoff alone."
    },
    {
        q: "7. Why is Adiponectin unique compared to virtually all other adipokines secreted by white adipose tissue?",
        options: [
            "A. It is only synthesized by skeletal muscle, not fat",
            "B. Its circulating concentration is paradoxically DECREASED in obesity, metabolic syndrome, and coronary artery disease",
            "C. It stimulates hunger directly via hypothalamic orexigenic neurons",
            "D. It requires vitamin D as an obligate co-factor for receptor binding"
        ],
        correct: 1,
        explanation: "Correct Answer: B. Adiponectin is anti-inflammatory, anti-atherogenic, and insulin-sensitizing via AMPK and PPAR-alpha. Uniquely, its synthesis and secretion collapse during adipocyte hypertrophy and hypoxia, meaning lower circulating levels predict higher metabolic risk."
    },
    {
        q: "8. What is the official risk-enhancing cutoff for Lipoprotein(a) [Lp(a)] recommended in the 2026 ACC/AHA Multisociety Guideline on Dyslipidemia?",
        options: [
            "A. ≥ 30 nmol/L (or ~10 mg/dL)",
            "B. ≥ 75 nmol/L (or ~30 mg/dL)",
            "C. ≥ 125 nmol/L (or approximately ~50 mg/dL)",
            "D. ≥ 300 nmol/L (or ~120 mg/dL)"
        ],
        correct: 2,
        explanation: "Correct Answer: C. The 2026 ACC/AHA guidelines designate an Lp(a) level of ≥ 125 nmol/L (~50 mg/dL) as an independent risk-enhancing factor, recommending that all adults be screened at least once in their lifetime."
    },
    {
        q: "9. In a patient with type 2 diabetes and high triglycerides, why can LDL-C be misleadingly normal while ApoB is dangerously elevated (Discordance)?",
        options: [
            "A. Triglycerides destroy ApoB molecules in the blood",
            "B. Hypertriglyceridemia drives the formation of small, dense LDL particles that carry less cholesterol per particle, resulting in high total atherogenic particle count despite normal cholesterol mass",
            "C. ApoB is only produced in the gut and does not reflect coronary artery disease",
            "D. LDL-C is cleared 10 times faster than HDL-C"
        ],
        correct: 1,
        explanation: "Correct Answer: B. Each atherogenic particle carries exactly ONE ApoB-100 molecule. In patients with metabolic syndrome, LDL particles are small and dense; thus, less cholesterol is contained inside each particle, masking a high, atherogenic particle number."
    },
    {
        q: "10. What is the clinical difference between FDA In Vitro Diagnostic (IVD) Clearance and FDA Biomarker Qualification?",
        options: [
            "A. There is no difference; they are identical regulatory pathways",
            "B. IVD clearance approves a specific commercial test kit/assay for clinical diagnostic use, whereas Biomarker Qualification establishes a biomarker for a defined drug-development context of use",
            "C. Biomarker Qualification applies only to veterinary medicine",
            "D. IVD clearance is conducted by the CDC rather than the FDA"
        ],
        correct: 1,
        explanation: "Correct Answer: B. FDA clearance/approval (via 510(k), De Novo, or PMA) evaluates a physical assay device for clinical testing. In contrast, the FDA Biomarker Qualification Program evaluates a biological marker for specific drug development and clinical trial contexts of use."
    }
];

let webQuizScore = 0;
let webUserAnswers = {};

function initWebQuiz() {
    const container = document.getElementById('webQuizContainer');
    if (!container) return;

    container.innerHTML = '';
    webQuizScore = 0;
    webUserAnswers = {};

    webQuizData.forEach((item, qIdx) => {
        const card = document.createElement('div');
        card.className = 'quiz-item-card';

        let optsHtml = '';
        item.options.forEach((optText, optIdx) => {
            optsHtml += `
                <button class="quiz-opt-btn" data-q="${qIdx}" data-opt="${optIdx}">
                    ${optText}
                </button>
            `;
        });

        card.innerHTML = `
            <div class="quiz-q-text">${item.q}</div>
            <div class="quiz-opts-group">${optsHtml}</div>
            <div class="quiz-feedback-box" id="webQuizExp_${qIdx}">
                ${item.explanation}
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', handleWebQuizClick);
    });

    const resetBtn = document.getElementById('btnResetWebQuiz');
    if (resetBtn) resetBtn.addEventListener('click', initWebQuiz);

    updateWebQuizScore();
}

function handleWebQuizClick(e) {
    const btn = e.currentTarget;
    const qIdx = parseInt(btn.dataset.q, 10);
    const selectedOpt = parseInt(btn.dataset.opt, 10);

    if (webUserAnswers[qIdx] !== undefined) return;

    webUserAnswers[qIdx] = selectedOpt;
    const item = webQuizData[qIdx];
    const isCorrect = (selectedOpt === item.correct);

    const group = btn.closest('.quiz-opts-group');
    const allBtns = group.querySelectorAll('.quiz-opt-btn');

    allBtns.forEach((b, idx) => {
        if (idx === item.correct) {
            b.classList.add('opt-correct');
        } else if (idx === selectedOpt && !isCorrect) {
            b.classList.add('opt-wrong');
        }
    });

    if (isCorrect) webQuizScore++;

    const expElem = document.getElementById(`webQuizExp_${qIdx}`);
    if (expElem) expElem.classList.add('active');

    updateWebQuizScore();
}

function updateWebQuizScore() {
    const answered = Object.keys(webUserAnswers).length;
    const scoreElem = document.getElementById('webQuizScoreVal');
    if (scoreElem) {
        scoreElem.innerText = `${webQuizScore} / ${webQuizData.length} (Answered ${answered} of ${webQuizData.length})`;
    }
}

// -------------------------------------------------------------
// 10. STICKY NAV SCROLL-SPY
// -------------------------------------------------------------
function initScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-item a');
    const sections = document.querySelectorAll('section[id], header[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// -------------------------------------------------------------
// DOM INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initBmiSimulator();
    initLeptinSimulator();
    initAdaEvaluator();
    initBcaaCalculator();
    initHba1cDetective();
    initLpaWebTool();
    initApobDiscordanceTool();
    initCompendiumSearch();
    initWebQuiz();
    initScrollSpy();
    console.log("Apple-Inspired Interactive Scientific Web Experience initialized successfully.");
});
