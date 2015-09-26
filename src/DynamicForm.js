module.exports = (function() {
  var DynamicForm = function() {
  this.form = $('<form>');
  this.fields = ['text',
                  'date',
                  'dateTime',
                  'email',
                  'number',
                  'url'];

  // Create a text input for naming new fields
  $inputName = $('<input id="input-name" type="text">');

  // Create a drop-down menu for selecting a new input type
  var $inputSelector = $('<select id="dynamic-form-select"></select>');
  for (var i = 0; i < this.fields.length; i++) {
    $inputSelector.append('<option>' + this.fields[i] + '</option>').attr('value', this.fields[i]);
  }

  // Create a button that triggers field create event
  $createButton = $('<button type="button" id="create-field"> Create Field </button>');

  this.form.append($inputName);
  this.form.append($inputSelector);
  this.form.append($createButton);
}

  DynamicForm.prototype.addField = function(fieldName, fieldType) {
      var inputHTML = '<input class="field" name="' + fieldName + '" type="' + fieldType + '"></input>';
      $newField = $('<br>' + '<span>' + fieldName + ': </span>' + inputHTML);
      this.form.append($newField);
  }

  DynamicForm.prototype.html = function() {
    return this.form.html();
  }

  DynamicForm.prototype.render = function(selector) {
    $(selector).append(this.form);
    var form = this;
    $(this.form).on('click', '#create-field', function(event) {
      var inputType = $('#dynamic-form-select').val();
      var inputName = $('#input-name').val();
      form.addField(inputName, inputType);
    });
  }

  DynamicForm.prototype.data = function() {
    var glyphData = {};
    this.form.children('.field').each(function(input) {
      var fieldName = $(this).attr('name');
      var fieldValue = $(this).val();
      glyphData[fieldName] = fieldValue;
    });

    return glyphData;
  }

  return DynamicForm;
})()