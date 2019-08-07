import rp from 'request-promise';

import Logger from '../utils/Logger';
import GoPipelineParser from '../utils/GoPipelineParser';
import Util from '../utils/Util';

const hostServiceSplit = ' -:- ';

export default class NagiosBuildService {

  constructor(goConfig) {
    this.conf = goConfig;
  }

  /**
   * @returns {Promise<Array<string>>} All available pipelines from the go.cd server
   */
  getAllPipelines() {
    const options = Util.createRequestOptions(`${this.conf.serverUrl}/cgi-bin/statusjson.cgi?query=servicelist`, this.conf, true);

    return rp(options)
      .then((res) => {
        let names = [];

        for (var host in res.data.servicelist) {
          for (var service in res.data.servicelist[host]) {
            names.push(`${service}${hostServiceSplit}${host}`)
          }
        }
        return names;
      }).catch((err) => {
        Logger.error('Failed to retrieve pipeline names');
        throw err
      });
  }

  /**
   * @returns {Promise<Array<Object>>} All available pipeline groups from the go.cd server
   */
  getPipelineGroups() {
    return Promise.resolve({});
  }

  /**
   * Retrive all pipelines paused info.
   * 
   * @return {Promise<Object}   
   * Example 
   * { 
   *   'pipeline1' : {
   *     paused : false,
   *     paused_by: null,
   *     pause_reason: null},
   *   'pipeline2' : {
   *     paused : true,
   *     paused_by : 'me',
   *     pause_reason : 'Under construction'
   *   }
   * }
   */
  getPipelinesPauseInfo() {

    return Promise.resolve({});
  
  }

  /**
   * @param   {string}          name  Name of the pipeline
   * @returns {Promise<Object>}       Pipeline instance. 
   * Example 
   * {
   *    name : 'id,
   *    buildtime : 1457085089646,
   *    author: 'Bobby Malone',
   *    counter: 255,
   *    paused: false,
   *    health: 2,
   *    stageresults: [
   *      {
   *        name: 'Build',
   *        status: 'passed',
   *        jobresults: [{
   *          name: 'build-job',
   *          result: 'passed',
   *          schedueld: 1457085089646
   *        }]
   *      },
   *      {
   *        name: 'Test',
   *        status: 'building'
   *        jobresults: []
   *      }] 
   * }
   */
  getPipelineHistory(name) {

    const split = name.split(hostServiceSplit);
    const host = split[1];
    const service = split[0]

    const options = Util.createRequestOptions(`${this.conf.serverUrl}/cgi-bin/statusjson.cgi?query=service&hostname=${host}&servicedescription=${service}`, this.conf, true);

    return rp(options)
      .then((res) => {

        let stageStatus = 'passed';
        if (res.data.service.status === 4 || res.data.service.status === 8)
          stageStatus = 'cancelled';
        else if (res.data.service.status === 16)
          stageStatus = 'failed';


        let statusResult = {
          name,
          health: res.data.service.status,
          paused: false,
          stageresults: [{
            name: 'Check',
            status: stageStatus,
            jobresults: []
          }],
          buildTime: res.data.service.last_check
        };

        return statusResult;
      })
      .catch((err) => {
        Logger.error(`Failed to get pipeline history for pipeline "${name}" returning last result, ${err.statusCode}: ${err.message}`);
        return this.pipelines ? this.pipelines.filter((p) => p && p.name === name)[0] : null;
      });
  }

}
