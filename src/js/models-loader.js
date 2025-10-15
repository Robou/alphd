// Fonction pour extraire les coordonnées du nom de fichier (NNNN_NNNN.nxz)
function extractCoordinates(filename) {
  const match = filename.match(/(\d{4})_(\d{4})/);
  if (match) {
    return {
      x: parseInt(match[1], 10),
      y: parseInt(match[2], 10)
    };
  }
  return null;
}

// Fonction pour obtenir un matériau selon le type (utilise les matériaux pré-définis)
function getMaterialByType(shaderType) {
  return materials[shaderType] || materials.normal;
}

// Fonction qui charge un modèle
function loadModel(modelPath) {
  if (loadedModels[modelPath]) {
    // Modèle déjà chargé, on le réaffiche
    scene.add(loadedModels[modelPath]);
    needsViewUpdate = true;
    redraw = true;
    return;
  }
  
  // Fonction appelée quand le modèle est chargé
  function onModelLoad() {
    var obj = loadedModels[modelPath];
    var s = 1; // échelle
    
    // Récupération des coordonnées du nom de fichier
    const coords = extractCoordinates(modelPath);
    if (coords) {
      // Appliquer uniquement l'échelle sans centrer le modèle
      obj.scale.set(s, s, s);
      
      // Positionner le modèle selon ses coordonnées extraites du nom
      obj.position.set(coords.x / 1, coords.y / 1, 0); // La coordonnée Z pourrait être ajoutée ici si disponible
      
      // Stocker la position pour le recadrage
      modelPositions[modelPath] = {
        coords: coords,
        boundingSphere: obj.geometry.boundingSphere.clone()
      };
      
      console.log(`Modèle ${modelPath} placé aux coordonnées (${obj.position.x}, ${obj.position.y}, ${obj.position.z})`);
    } else {
      // Pour les modèles sans coordonnées, on peut laisser la position brute ou appliquer une logique différente
      obj.scale.set(s, s, s);
    }
    
    needsViewUpdate = true;
    redraw = true;
  }
  
  // Utiliser le shader sélectionné dans les options
  let material = getMaterialByType(currentShader);
  
  var nexus_obj = new NexusObject(modelPath, onModelLoad, function() { redraw = true; }, renderer, material);
  loadedModels[modelPath] = nexus_obj;
  scene.add(nexus_obj);
  showBoundingBox(modelPath, true);
}

// Fonction qui retire un modèle de la scène
function unloadModel(modelPath) {
  if (loadedModels[modelPath]) {
    scene.remove(loadedModels[modelPath]);
    
    // Supprimer aussi la bounding box si elle existe
    if (boundingBoxHelpers[modelPath]) {
      scene.remove(boundingBoxHelpers[modelPath]);
      delete boundingBoxHelpers[modelPath];
    }
    
    needsViewUpdate = true;
    redraw = true;
  }
}

// Fonction pour recadrer la caméra sur tous les modèles visibles
function updateCameraView() {
  // Si aucun modèle n'est visible, on ne fait rien
  const visibleModels = Object.keys(loadedModels).filter(key => scene.children.includes(loadedModels[key]));
  if (visibleModels.length === 0) return;
  
  // Créer une boîte englobante pour tous les modèles visibles
  const box = new THREE.Box3();
  
  visibleModels.forEach(modelPath => {
    const model = loadedModels[modelPath];
    if (model && model.geometry) {
      // Calcul de la boîte englobante du modèle dans l'espace mondial
      const modelBox = new THREE.Box3().setFromObject(model);
      box.union(modelBox);
    }
  });
  
  // Calculer le centre et la taille de la boîte
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = box.getSize(new THREE.Vector3());
  
  // Calculer la distance nécessaire pour voir toute la boîte
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
  
  // Ajouter une marge
  cameraZ *= 1.5;
  
  // Positionner la caméra
  camera.position.set(center.x, center.y, center.z + cameraZ);
  camera.lookAt(center);
  
  // Mettre à jour les contrôles
  controls.target.copy(center);
  controls.update();
  
  // Forcer le rendu
  redraw = true;
  needsViewUpdate = false;
}

// Création de l'interface graphique
function createGUI(modelList) {
  var gui = document.createElement('div');
  gui.id = 'gui';
  document.body.appendChild(gui);
  
  var title = document.createElement('h3');
  title.textContent = 'Modèles disponibles';
  title.style.margin = '0 0 10px 0';
  gui.appendChild(title);
  
  // Checkbox pour sélectionner/désélectionner tout
  var selectAllContainer = document.createElement('div');
  selectAllContainer.style.marginBottom = '10px';
  selectAllContainer.style.borderBottom = '1px solid #ccc';
  selectAllContainer.style.paddingBottom = '10px';
  
  var selectAllLabel = document.createElement('label');
  selectAllLabel.style.fontWeight = 'bold';
  var selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.id = 'select-all-checkbox';
  
  selectAllLabel.appendChild(selectAllCheckbox);
  selectAllLabel.appendChild(document.createTextNode(' Sélectionner tout'));
  selectAllContainer.appendChild(selectAllLabel);
  gui.appendChild(selectAllContainer);
  
  // Conteneur pour les checkboxes
  var checkboxContainer = document.createElement('div');
  checkboxContainer.style.maxHeight = '50vh';
  checkboxContainer.style.overflowY = 'auto';
  gui.appendChild(checkboxContainer);
  
  modelList.forEach(function(model) {
    var label = document.createElement('label');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = model;
    checkbox.className = 'model-checkbox';
    
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        loadModel(this.value);
      } else {
        unloadModel(this.value);
      }
      
      // Afficher le bouton de recadrage si nécessaire
      updateRecenterButton(true);
      
      // Mettre à jour l'état de la checkbox "Sélectionner tout"
      updateSelectAllCheckbox();
    });
    
    // Extraire les coordonnées pour l'affichage
    const coords = extractCoordinates(model);
    const displayText = coords ?
      ` ${model.replace('models/', '')} (${coords.x},${coords.y})` :
      ` ${model.replace('models/', '')}`;
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(displayText));
    checkboxContainer.appendChild(label);
  });
  
  // Gestionnaire d'événement pour la checkbox "Sélectionner tout"
  selectAllCheckbox.addEventListener('change', function() {
    var modelCheckboxes = document.querySelectorAll('.model-checkbox');
    var isChecked = this.checked;
    
    modelCheckboxes.forEach(function(checkbox) {
      if (checkbox.checked !== isChecked) {
        checkbox.checked = isChecked;
        
        // Déclencher l'événement change pour charger/décharger les modèles
        if (isChecked) {
          loadModel(checkbox.value);
        } else {
          unloadModel(checkbox.value);
        }
      }
    });
    
    // Afficher le bouton de recadrage si nécessaire
    if (isChecked && modelCheckboxes.length > 0) {
      updateRecenterButton(true);
    } else if (!isChecked) {
      updateRecenterButton(false);
    }
  });
  
  // Ajouter un bouton pour recadrer la vue
  var buttonContainer = document.createElement('div');
  buttonContainer.style.marginTop = '10px';
  buttonContainer.id = 'button-container';
  buttonContainer.style.display = 'none'; // Masqué par défaut
  gui.appendChild(buttonContainer);
  
  var recenterButton = document.createElement('button');
  recenterButton.textContent = 'Recadrer la vue';
  recenterButton.style.padding = '5px 10px';
  recenterButton.addEventListener('click', updateCameraView);
  buttonContainer.appendChild(recenterButton);
  
  var toggleBoxesButton = document.createElement('button');
  toggleBoxesButton.textContent = 'Afficher/Masquer Boîtes';
  toggleBoxesButton.style.padding = '5px 10px';
  toggleBoxesButton.style.marginLeft = '10px';

  var boxesVisible = true;

  toggleBoxesButton.addEventListener('click', function() {
    boxesVisible = !boxesVisible;
    toggleAllBoundingBoxes(boxesVisible);
  });

  buttonContainer.appendChild(toggleBoxesButton);
}

// Fonction pour mettre à jour l'état de la checkbox "Sélectionner tout"
function updateSelectAllCheckbox() {
  var selectAllCheckbox = document.getElementById('select-all-checkbox');
  var modelCheckboxes = document.querySelectorAll('.model-checkbox');
  
  if (!selectAllCheckbox || modelCheckboxes.length === 0) return;
  
  var checkedCount = 0;
  modelCheckboxes.forEach(function(checkbox) {
    if (checkbox.checked) checkedCount++;
  });
  
  if (checkedCount === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCount === modelCheckboxes.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

// Fonction pour afficher/masquer le bouton de recadrage
function updateRecenterButton(show) {
  const buttonContainer = document.getElementById('button-container');
  if (buttonContainer) {
    buttonContainer.style.display = show ? 'block' : 'none';
  }
}

// Chargement de la liste des modèles
function loadModelList() {
  fetch('/models')
    .then(response => response.json())
    .then(data => {
      models = data;
      createGUI(models);
    })
    .catch(error => {
      console.error('Erreur lors du chargement de la liste des modèles:', error);
      // En cas d'erreur, utilisez une liste statique pour les tests
      var fallbackModels = [
        'models/0966_6428.nxz'
      ];
      models = fallbackModels;
      createGUI(fallbackModels);
    });
}
