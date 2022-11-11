/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  buildQueryContext,
  DTTM_ALIAS,
  QueryFormData,
} from '@superset-ui/core';
import {
  flattenOperator,
  pivotOperator,
  resampleOperator,
  rollingWindowOperator,
} from '@superset-ui/chart-controls';

export default function buildQuery(formData: QueryFormData) {
  return buildQueryContext(formData, baseQueryObject => {
    const { x_axis } = formData;
    const is_timeseries = x_axis === DTTM_ALIAS || !x_axis;

    return [
      {
        ...baseQueryObject,
        is_timeseries: true,
        post_processing: [
          pivotOperator(formData, {
            ...baseQueryObject,
            index: x_axis,
            is_timeseries,
          }),
          rollingWindowOperator(formData, baseQueryObject),
          resampleOperator(formData, baseQueryObject),
          flattenOperator(formData, baseQueryObject),
        ],
      },
    ];
  });
}
