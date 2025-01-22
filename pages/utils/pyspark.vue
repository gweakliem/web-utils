<template>
  <div class="bigquery-to-pyspark max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">BigQuery to PySpark Schema Converter</h1>
    
    <!-- Instructions Section -->
    <div class="mb-4 p-4 bg-gray-100 border rounded">
      <p>To export the schema you can use the <code class="bg-gray-200 p-1 rounded">bq</code> command like this:</p>
      <pre class="bg-gray-200 p-2 rounded">bq show --schema project_id:dataset.table_name</pre>
    </div>

    <div class="space-y-4">
      <div>
        <label for="bigquerySchema" class="block text-sm font-medium mb-2">BigQuery Schema</label>
        <textarea
          id="bigquerySchema"
          v-model="bigquerySchema"
          rows="6"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter BigQuery schema JSON..."
        ></textarea>
      </div>

      <div class="flex justify-center space-x-4">
        <button
          @click="convertSchema"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Convert
        </button>
      </div>

      <div v-if="errorMessage" class="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
        {{ errorMessage }}
      </div>

      <div v-if="pysparkSchema" class="relative p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
        <button @click="copyToClipboard"
          class="absolute top-2 right-2 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
          :title="copySuccess ? 'Copied!' : 'Copy to clipboard'">
          <Icon :name="copySuccess ? 'mdi:check' : 'mdi:content-copy'" class="w-5 h-5" />
        </button>
        <pre class="whitespace-pre-wrap break-words">{{ pysparkSchema }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const bigquerySchema = ref('')
const pysparkSchema = ref('')
const errorMessage = ref('')
const copySuccess = ref(false)

const convertSchema = () => {
  try {
    const schema = JSON.parse(bigquerySchema.value)
    pysparkSchema.value = convertBigQueryToPySpark(schema)
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = `Conversion failed: ${error.message}`
    pysparkSchema.value = ''
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(pysparkSchema.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}

const convertBigQueryToPySpark = (schema) => {
  const convertField = (field) => {
    const typeMapping = {
      STRING: 'StringType()',
      BOOL: 'BooleanType()',
      BOOLEAN: 'BooleanType()',
      BYTES: 'BinaryType()',
      DATE: 'DateType()',
      DATETIME: 'TimestampType()', // PySpark does not have a direct equivalent for DATETIME
      GEOGRAPHY: 'StringType()', // No direct equivalent, consider using a library for geospatial data
      INTERVAL: 'StringType()', // No direct equivalent, consider custom handling
      JSON: 'StringType()', // PySpark does not have a JSON type, consider using StringType
      INT64: 'LongType()',
      INT: 'IntegerType()',
      SMALLINT: 'ShortType()',
      INTEGER: 'IntegerType()',
      BIGINT: 'LongType()',
      TINYINT: 'ByteType()',
      BYTEINT: 'ByteType()',
      NUMERIC: 'DecimalType(38, 9)', // Adjust precision and scale as needed
      DECIMAL: 'DecimalType(38, 9)', // Adjust precision and scale as needed
      BIGNUMERIC: 'DecimalType(76, 38)', // Adjust precision and scale as needed
      BIGDECIMAL: 'DecimalType(76, 38)', // Adjust precision and scale as needed
      FLOAT64: 'DoubleType()',
      FLOAT: 'FloatType()',
      RANGE: 'StringType()', // No direct equivalent, consider custom handling
      TIME: 'StringType()', // No direct equivalent, consider using StringType
      TIMESTAMP: 'TimestampType()',
      ARRAY: 'ArrayType()', // Requires special handling for element type
      STRUCT: 'StructType()', // Requires special handling for nested fields
    }

    let fieldType;
    if (field.type === 'ARRAY') {
      // Handle ARRAY type
      const elementType = convertField({ type: field.elementType, name: field.name });
      fieldType = `ArrayType(${elementType})`;
    } else if (field.type === 'STRUCT') {
      // Handle STRUCT type
      const structFields = field.fields.map(convertField);
      fieldType = `StructType([${structFields.join(', ')}])`;
    } else {
      fieldType = typeMapping[field.type] || 'StringType()'; // Default to StringType if unknown
    }

    return `StructField("${field.name}", ${fieldType}, ${field.mode !== 'REQUIRED'})`;
  }

  const fields = schema.map(convertField);
  return `StructType([${fields.join(', ')}])`;
}
</script> 