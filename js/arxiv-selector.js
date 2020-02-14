/* -*- mode: javascript; js-indent-level: 2 -*- */

angular
  .module('arxivSelector', [])
  .directive('arxivSelector', function () {
    return {
      restrict: 'E',
      scope: {
	selection: '='
      },
      templateUrl: 'template/arxiv-selector.html',
      link: function ($scope) {
	$scope.database = makeArxivDatabase();
	if ($scope.selection) {
	  reconstructSelection($scope.selection, $scope.database);
	} else {
	  $scope.selection = buildQuery($scope.database);
	}
	$scope.selectTopic = function (topic,area) {
	  if (area.selected) {
	    clearChildren(area, true);
	    topic.selected = false;
	    area.selected = false;
	  } else if (topic.selected) {
	    topic.selected = false;
	  } else {
	    topic.selected = true;
	  }
	  $scope.selection = buildQuery($scope.database);
	};
	$scope.selectArea = function (area) {
	  if (area.subareas) {
	    clearChildren(area, false);
	  }
	  area.selected = !area.selected;
	  $scope.selection = buildQuery($scope.database);
	};
	$scope.toggleField = function (field) {
	  field.open = !field.open;
	};
	$scope.someSelected = function (field) {
	  function innerArray(array) {
	    for (var i = 0; i < array.length; ++i) {
	      if (inner(array[i]))
		return true;
	    }
	  }
	  function inner(area) {
	    return area.selected || (area.subareas && innerArray(area.subareas));
	  }
	  return innerArray(field.areas);
	};
      }
    };

    function reconstructSelection(query,database) {
      function innerArray(query, array) {
	var L = array.length;
	for (var i = 0; i < L; ++i)
	  inner(query, array[i]);
      }

      function inner(query, area) {
	area.selected = query.indexOf(area.code) >= 0;
	if (area.subareas) {
	  innerArray(query, area.subareas);
	}
      }

      var L = database.length;
      for (var i = 0; i < L; ++i)
	innerArray(query, database[i].areas);
    }

    function areaQuery(query,area) {
      if (area.selected) {
	return (query ? (query + '+OR+cat:') : 'cat:') + area.code;
      } else if (area.subareas) {
	var L = area.subareas.length;
	for (var i = 0; i < L; ++i) {
	  query = areaQuery(query, area.subareas[i]);
	}
      }
      return query;
    }

    function buildQuery(database) {
      var L = database.length;
      var query = null;
      for (var i = 0; i < L; ++i) {
	var areas = database[i].areas;
	var M = areas.length;
	for (var j = 0; j < M; ++j) {
	  query = areaQuery(query, areas[j]);
	}
      }
      return query;
    }

    function clearChildren(area, value) {
      var L = area.subareas.length;
      for (var i = 0; i < L; ++i)
	area.subareas[i].selected = value;
    }

    function makeArxivDatabase() {
      return [
	{ name: 'Physics',
	  areas: [
	    { code: 'astro-ph*',
	      selected: false,
	      name: 'Astrophysics',
	      subareas: [
		{ code: 'astro-ph.GA',
		  selected: false,
		  name: 'Astrophysics of Galaxies' },
		{ code: 'astro-ph.CO',
		  selected: false,
		  name: 'Cosmology and Nongalactic Astrophysics' },
		{ code: 'astro-ph.EP',
		  selected: false,
		  name: 'Earth and Planetary Astrophysics' },
		{ code: 'astro-ph.HE',
		  selected: false,
		  name: 'High Energy Astrophysical Phenomena' },
		{ code: 'astro-ph.IM',
		  selected: false,
		  name: 'Instrumentation and Methods for Astrophysics' },
		{ code: 'astro-ph.SR',
		  selected: false,
		  name: 'Solar and Stella Astrophysics' }]}, /* astro-ph */
	    { code: 'cond-mat*',
	      selected: false,
	      name: 'Condensed Matter Physics',
	      subareas: [
		{ code: 'cond-mat.dis-nn',
		  selected: false,
		  name: 'Disordered Systems and Neural Networks' },
		{ code: 'cond-mat.mtrl-sci',
		  selected: false,
		  name: 'Materials Science' },
		{ code: 'cond-mat.mes-hall',
		  selected: false,
		  name: 'Mesoscale and Nanoscale Physics' },
		{ code: 'cond-mat.other',
		  selected: false,
		  name: 'Other Condensed Matter' },
		{ code: 'cond-mat.quant-gas',
		  selected: false,
		  name: 'Quantum Gases' },
		{ code: 'soft',
		  selected: false,
		  name: 'Soft Condensed Matter' },
		{ code: 'cond-mat.stat-mech',
		  selected: false,
		  name: 'Statistical Mechanics' },
		{ code: 'cond-mat.str-el',
		  selected: false,
		  name: 'Strongly Correlated Electrons' },
		{ code: 'cond-mat.supr-con',
		  selected: false,
		  name: 'Superconductivity' }]}, /* cond-mat */
	    { code: 'gr-qc',
	      selected: false,
	      name: 'General Relativity and Quantum Cosmology' },
	    { code: 'hep-ex',
	      selected: false,
	      name: 'High Energy Physics - Experiment' },
	    { code: 'hep-lat',
	      selected: false,
	      name: 'High Energy Physics - Lattice' },
	    { code: 'hep-ph',
	      selected: false,
	      name: 'High Energy Physics - Phenomenology' },
	    { code: 'hep-th',
	      selected: false,
	      name: 'High Energy Physics - Theory' },
	    { code: 'math-ph',
	      selected: false,
	      name: 'Mathematical Physics' },
	    { code: 'nucl-ex',
	      selected: false,
	      name: 'Nuclear Experiment' },
	    { code: 'nucl-th',
	      selected: false,
	      name: 'Nuclear Theory' },
	    { code: 'physics*',
	      selected: false,
	      name: 'Physics',
	      subareas: [
		{ code: 'physics.acc-ph',
		  selected: false,
		  name: 'Accelerator Physics' },
		{ code: 'physics.ao-ph',
		  selected: false,
		  name: 'Atmospheric and Oceanic Physics' },
		{ code: 'physics.atom-ph',
		  selected: false,
		  name: 'Atomic Physics' },
		{ code: 'physics.atm-clus',
		  selected: false,
		  name: 'Atomic and Molecular Clusters' },
		{ code: 'physics.bio-ph',
		  selected: false,
		  name: 'Biological Physics' },
		{ code: 'physics.chem-ph',
		  selected: false,
		  name: 'Chemical Physics' },
		{ code: 'physics.class-ph',
		  selected: false,
		  name: 'Classical Physics' },
		{ code: 'physics.comp-ph',
		  selected: false,
		  name: 'Computational Physics' },
		{ code: 'physics.data-an',
		  selected: false,
		  name: 'Data Analysis, Statistics and Probability' },
		{ code: 'physics.flu-dyn',
		  selected: false,
		  name: 'Fluid Dynamics' },
		{ code: 'physics.gen-ph',
		  selected: false,
		  name: 'General Physics' },
		{ code: 'physics.geo-ph',
		  selected: false,
		  name: 'Geophysics' },
		{ code: 'physics.hist-ph',
		  selected: false,
		  name: 'History and Philosophy of Physics' },
		{ code: 'physics.ins-det',
		  selected: false,
		  name: 'Instrumentation and Detectors' },
		{ code: 'physics.med-ph',
		  selected: false,
		  name: 'Medical Physics' },
		{ code: 'physics.optics',
		  selected: false,
		  name: 'Optics' },
		{ code: 'physics.ed-ph',
		  selected: false,
		  name: 'Physics Education' },
		{ code: 'physics.soc-ph',
		  selected: false,
		  name: 'Physics and Society' },
		{ code: 'physics.plasma-ph',
		  selected: false,
		  name: 'Plasma Physics' },
		{ code: 'physics.pop-ph',
		  selected: false,
		  name: 'Popular Physics' },
		{ code: 'physics.space-ph',
		  selected: false,
		  name: 'Space Physics' }]}, /* physics */
	    { code: 'quant-ph',
	      selected: false,
	      name: 'Quantum Physics' }]}, /* Physics */
	{ name: 'Mathematics',
	  areas: [
	    { code: 'math*',
	      selected: false,
	      name: 'Mathematics',
	      subareas: [
		{ code: 'math.AG',
		  selected: false,
		  name: 'Algebraic Geometry' },
		{ code: 'math.AT',
		  selected: false,
		  name: 'Algebraic Topology' },
		{ code: 'math.AP',
		  selected: false,
		  name: 'Analysis of PDEs' },
		{ code: 'math.CT',
		  selected: false,
		  name: 'Category Theory' },
		{ code: 'math.CA',
		  selected: false,
		  name: 'Classical Analysis and ODEs' },
		{ code: 'math.CO',
		  selected: false,
		  name: 'Combinatorics' },
		{ code: 'math.AC',
		  selected: false,
		  name: 'Commutative Algebra' },
		{ code: 'math.CV',
		  selected: false,
		  name: 'Complex Variables' },
		{ code: 'math.DG',
		  selected: false,
		  name: 'Differential Geometry' },
		{ code: 'math.DS',
		  selected: false,
		  name: 'Dynamical Systems' },
		{ code: 'math.FA',
		  selected: false,
		  name: 'Functional Analysis' },
		{ code: 'math.GM',
		  selected: false,
		  name: 'General Mathematics' },
		{ code: 'math.GN',
		  selected: false,
		  name: 'General Topology' },
		{ code: 'math.GT',
		  selected: false,
		  name: 'Geometric Topology' },
		{ code: 'math.GR',
		  selected: false,
		  name: 'Group Theory' },
		{ code: 'math.HO',
		  selected: false,
		  name: 'History and Overview' },
		{ code: 'math.IT',
		  selected: false,
		  name: 'Information Theory' },
		{ code: 'math.KT',
		  selected: false,
		  name: 'K-Theory and Homology' },
		{ code: 'math.LO',
		  selected: false,
		  name: 'Logic' },
		{ code: 'math.MP',
		  selected: false,
		  name: 'Mathematical Physics' },
		{ code: 'math.MG',
		  selected: false,
		  name: 'Metric Geometry' },
		{ code: 'math.NT',
		  selected: false,
		  name: 'Number Theory' },
		{ code: 'math.NA',
		  selected: false,
		  name: 'Numerical Analysis' },
		{ code: 'math.OA',
		  selected: false,
		  name: 'Operator Algebras' },
		{ code: 'math.OC',
		  selected: false,
		  name: 'Optimization and Control' },
		{ code: 'math.PR',
		  selected: false,
		  name: 'Probability' },
		{ code: 'math.QA',
		  selected: false,
		  name: 'Quantum Algebra' },
		{ code: 'math.RT',
		  selected: false,
		  name: 'Representation Theory' },
		{ code: 'math.RA',
		  selected: false,
		  name: 'Rings and Algebras' },
		{ code: 'math.SP',
		  selected: false,
		  name: 'Spectral Theory' },
		{ code: 'math.ST',
		  selected: false,
		  name: 'Statistics Theory' },
		{ code: 'math.SG',
		  selected: false,
		  name: 'Symplectic Geometry' }]}]}, /* Mathematics */
	{ name: 'Nonlinear Sciences',
	  areas: [
	    { code: 'nlin*',
	      selected: false,
	      name: 'Nonlinear Sciences',
	      subareas: [
		{ code: 'nlin.AO',
		  selected: false,
		  name: 'Adaptation and Self-Organizing Systems' },
		{ code: 'nlin.CG',
		  selected: false,
		  name: 'Cellular Automata and Lattice Gases' },
		{ code: 'nlin.CD',
		  selected: false,
		  name: 'Chaotic Dynamics' },
		{ code: 'nlin.SI',
		  selected: false,
		  name: 'Exactly Solvable and Integrable Systems' },
		{ code: 'nlin.PS',
		  selected: false,
		  name: 'Pattern Formation and Solitons' }]}]}, /* Nonlinear Sciences */
	{ name: 'Computer Science',
	  areas: [
	    { code: 'cs*',
	      selected: false,
	      name: 'Computer Research Repository',
	      subareas: [
		{ code: 'cs.AI',
		  selected: false,
		  name: 'Artificial Intelligence' },
		{ code: 'cs.CL',
		  selected: false,
		  name: 'Computation and Language' },
		{ code: 'cs.CC',
		  selected: false,
		  name: 'Computation Complexity' },
		{ code: 'cs.CE',
		  selected: false,
		  name: 'Computation Engineering, Finance and Science' },
		{ code: 'cs.CG',
		  selected: false,
		  name: 'Computational Geometry' },
		{ code: 'cs.GT',
		  selected: false,
		  name: 'Computer Science and Game Theory' },
		{ code: 'cs.CV',
		  selected: false,
		  name: 'Computer Vision and Pattern Recognition' },
		{ code: 'cs.CY',
		  selected: false,
		  name: 'Computers and Society' },
		{ code: 'cs.CR',
		  selected: false,
		  name: 'Cryptography and Security' },
		{ code: 'cs.DS',
		  selected: false,
		  name: 'Data Structures and Algorithms' },
		{ code: 'cs.DB',
		  selected: false,
		  name: 'Databases' },
		{ code: 'cs.DL',
		  selected: false,
		  name: 'Digital Libraries' },
		{ code: 'cs.DM',
		  selected: false,
		  name: 'Discrete Mathematics' },
		{ code: 'cs.DC',
		  selected: false,
		  name: 'Distributed, Parallel, and Cluster Computing' },
		{ code: 'cs.ET',
		  selected: false,
		  name: 'Emerging Technologies' },
		{ code: 'cs.FL',
		  selected: false,
		  name: 'Formal Languages and Automata Theory' },
		{ code: 'cs.GL',
		  selected: false,
		  name: 'General Literature' },
		{ code: 'cs.GR',
		  selected: false,
		  name: 'Graphics' },
		{ code: 'cs.AR',
		  selected: false,
		  name: 'Hardware Architecture' },
		{ code: 'cs.HC',
		  selected: false,
		  name: 'Human-Computer Interaction' },
		{ code: 'cs.IR',
		  selected: false,
		  name: 'Information Retrieval' },,
		{ code: 'cs.IT',
		  selected: false,
		  name: 'Information Theory' },
		{ code: 'cs.LO',
		  selected: false,
		  name: 'Logic in Computer Science' },
		{ code: 'cs.LG',
		  selected: false,
		  name: 'Machine Learning'},
		{ code: 'cs.MS',
		  selected: false,
		  name: 'Mathematical Software' },
		{ code: 'cs.MA',
		  selected: false,
		  name: 'Multiagent Systems' },
		{ code: 'cs.MM',
		  selected: false,
		  name: 'Multimedia' },
		{ code: 'cs.NI',
		  selected: false,
		  name: 'Networking and Internet Architecture' },
		{ code: 'cs.NE',
		  selected: false,
		  name: 'Neural and Evolutionary Computing' },
		{ code: 'cs.NA',
		  selected: false,
		  name: 'Numerical Analysis' },
		{ code: 'cs.OS',
		  selected: false,
		  name: 'Operating System' },
		{ code: 'cs.OH',
		  selected: false,
		  name: 'Other Computer Science' },
		{ code: 'cs.PF',
		  selected: false,
		  name: 'Performance' },
		{ code: 'cs.PL',
		  selected: false,
		  name: 'Programming Languages' },
		{ code: 'cs.RO',
		  selected: false,
		  name: 'Robotics' },
		{ code: 'cs.SI',
		  selected: false,
		  name: 'Social and Information Networks' },
		{ code: 'cs.SE',
		  selected: false,
		  name: 'Software Engineering' },
		{ code: 'cs.SD',
		  selected: false,
		  name: 'Sound' },
		{ code: 'cs.SC',
		  selected: false,
		  name: 'Symbolic Computation' },
		{ code: 'cs.SY',
		  selected: false,
		  name: 'Systems and Control' }]}]}, /* Computer Science */
	{ name: 'Quantitative Biology',
	  areas: [
	    { code: 'q-bio*',
	      selected: false,
	      name: 'Quantitative Biology',
	      subareas: [
		{ code: 'q-bio.BM',
		  selected: false,
		  name: 'Biomolecules' },
		{ code: 'q-bio.CB',
		  selected: false,
		  name: 'Cell Behavior' },
		{ code: 'q-bio.GN',
		  selected: false,
		  name: 'Genomics' },
		{ code: 'q-bio.MN',
		  selected: false,
		  name: 'Molecular Networks' },
		{ code: 'q-bio.NC',
		  selected: false,
		  name: 'Neurons and Cognition' },
		{ code: 'q-bio.OT',
		  selected: false,
		  name: 'Other Quatitative Biology' },
		{ code: 'q-bio.PE',
		  selected: false,
		  name: 'Populations and Evolution' },
		{ code: 'q-bio.QM',
		  selected: false,
		  name: 'Quantitative Methods' },
		{ code: 'q-bio.SC',
		  selected: false,
		  name: 'Subcellular Processes' },
		{ code: 'q-bio.TO',
		  selected: false,
		  name: 'Tissues and Organs' }]}]}, /* Quantitative Biology */
	{ name: 'Quantitative Finance',
	  areas: [
	    { code: 'q-fin*',
	      selected: false,
	      name: 'Quantitative Finance',
	      subareas: [
		{ code: 'q-fin.CP',
		  selected: false,
		  name: 'Computational Finance' },
		{ code: 'q-fin.EC',
		  selected: false,
		  name: 'Economics' },
		{ code: 'q-fin.GN',
		  selected: false,
		  name: 'General Finance' },
		{ code: 'q-fin.MF',
		  selected: false,
		  name: 'Mathematical Finance' },
		{ code: 'q-fin.PM',
		  selected: false,
		  name: 'Portfolio Management' },
		{ code: 'q-fin.PR',
		  selected: false,
		  name: 'Pricing of Securities' },
		{ code: 'q-fin.RM',
		  selected: false,
		  name: 'Risk Management' },
		{ code: 'q-fin.ST',
		  selected: false,
		  name: 'Statistical Finance' },
		{ code: 'q-fin.TR',
		  selected: false,
		  name: 'Trading and Market Microstructure' }]}]}, /* Quant. Fin. */
	{ name: 'Statistics',
	  areas: [
	    { code: 'stat*',
	      selected: false,
	      name: 'Statistics',
	      subareas: [
		{ code: 'stat.AP',
		  selected: false,
		  name: 'Applications' },
		{ code: 'stat.CO',
		  selected: false,
		  name: 'Computation' },
		{ code: 'stat.ML',
		  selected: false,
		  name: 'Machine Learning' },
		{ code: 'stat.ME',
		  selected: false,
		  name: 'Methodology' },
		{ code: 'stat.OT',
		  selected: false,
		  name: 'Other Statistics' },
		{ code: 'stat.TH',
		  selected: false,
		  name: 'Statistics Theory' }]}]}, /* Statistics */
	{ name: 'Electrical Engineerign and Systems Science',
	  areas: [
	    { code: 'eess*',
	      selected: false,
	      name: 'Electrical Engineering and Systems Scicence',
	      subareas: [
		{ code: 'eess.AS',
		  selected: false,
		  name: 'Audio and Speech Processing' },
		{ code: 'eess.IV',
		  selected: false,
		  name: 'Image and Video Processing' },
		{ code: 'eess.SP',
		  selected: false,
		  name: 'Signal Processing' },
		{ code: 'eess.SY',
		  selected: false,
		  name: 'Systems and Control' }]}]}, /* Electrical Engineering and Systems Science */
	{ name: 'Economics',
	  areas: [
	    { code: 'econ*',
	      selected: false,
	      name: 'Economics',
	      subareas: [
		{ code: 'econ.EM',
		  selected: false,
		  name: 'Econometrics' },
		{ code: 'econ.GN',
		  selected: false,
		  name: 'General Economics' },
		{ code: 'econ.TH',
		  selected: false,
		  name: 'Theoretical Economics' }]}]} /* Economics */
      ];
    };
  });
