var pg = require('pg-query');

var db_name = 'maxifleet_db'
pg.connectionParameters = 'postgres://postgres:Administrator1@127.0.0.1:5432/' + db_name;

function get_area_defs(req, res, next) {
   const companyId = req.query.companyId;
   
   const query =
   `SELECT ar_area_def.*, COALESCE(MAX(mxsses_end_time), arar_insertion_time) AS last_updated FROM ar_area_def
   LEFT JOIN mxar_object ON mx_arobj_guid = arar_uid AND mx_arobj_company = arar_company
   LEFT JOIN mxar_sub_object ON mxarsubobj_object = mxarobj_id
   LEFT JOIN mxs_session ON mxarsubobj_id = mxsses_sub_object
   WHERE arar_removal_time is null
   AND arar_company = ${companyId}
   AND (arar_uid != 'Standard Pricelist' AND arar_name != 'Default')    
   GROUP BY arar_id
   ORDER BY last_updated DESC
   LIMIT 100;`

   pg(query, function(err, rows, result) {
      if (err) {
         res.send(500, {
            http_status: 500,
            error_msg: err
         })
         return console.error('error running query', err);
      }
      res.send(rows);
      console.log("running query - area defs");
      return rows;
   });
}


function select_box(req, res, next) {
   var table_name = 'ext_sks_felling'
   var query = req.query;
   const limit = (typeof(query.limit) !== "undefined") ? query.limit : 40;
   const age = (typeof(query.limit) !== "undefined") ? query.age : 3;
   // param check
   if (!(Number(query.lat1) &&
         Number(query.lon1) &&
         Number(query.lat2) &&
         Number(query.lon2) &&
         Number(limit))) {
      res.send(500, {
         http_status: 400,
         error_msg: "this endpoint requires two pair of lat, long coordinates: lat1 lon1 lat2 lon2\na query 'limit' parameter can be optionally specified as well."
      });
      return console.error('could not connect to postgres', err);
   }

   // not standard.. fetures as array
   const sqlFeture = `SELECT json_build_object(
    'type',       'Feature',
    'id',         gid,
    'geometry',   ST_AsGeoJSON(geom)::JSON,
    'properties', json_build_object(
	      'lan', lan,
        'kommun', kommun,
        'beteckn', beteckn,
        'avverktyp', avverktyp,
        'skogstyp', skogstyp,
        'inkomdatum', inkomdatum,
	      'anmaldha', anmaldha,
	      'skogsodlha', skogsodlha,
	      'natforha', natforha,
        'arendestat', arendestat,
        'avvsasong', avvsasong,
        'avvha', avvha
     )) FROM ${table_name} 
     WHERE geom && ST_MakeEnvelope(${query.lon1}, ${query.lat1}, ${query.lon2}, ${query.lat2})
     AND inkomdatum > now() - interval '${age} year' LIMIT ${limit};`;

   // run query
   pg(sqlFeture, function(err, rows, result) {
      if (err) {
         res.send(500, {
            http_status: 500,
            error_msg: err
         })
         return console.error('error running query', err);
      }
      res.send(rows);
      return rows;
   });
};

function get_location_history(req, res, next) {
   var areaUid = req.query.areaUid;

   const sqlTracking =
      `SELECT ST_X(locposh_point) AS lon, ST_Y(locposh_point) AS lat, locposh_timestamp AS time, locposh_entity_guid AS guid, locposh_machine_status AS status, locposh_session AS session FROM loc_pos_history
    INNER JOIN mxs_session ON mxsses_id = locposh_session
    INNER JOIN mxar_sub_object ON mxsses_sub_object = mxarsubobj_id
    INNER JOIN mxar_object ON mxarsubobj_object = mxarobj_id
    WHERE mx_arobj_guid = '${areaUid}'
    ORDER BY locposh_id;`

   pg(sqlTracking, function(err, rows, result) {
      if (err) {
         res.send(500, {
            http_status: 500,
            error_msg: err
         })
         return console.error('error running query', err);
      }
      res.send(rows);
      console.log("running query - tracking");
      return rows;
   });
}

function get_location_production(req, res, next) {
   var areaUid = req.query.areaUid;

   const sqlProduction =
      `SELECT mxprts_name AS species, mxhvpt_code AS process, ST_X(mxhvs_point) AS lat, ST_Y(mxhvs_point) AS lon, mxhvs_timestamp AS time, mxhvs_dbh AS dbh FROM mxhv_stem
    INNER JOIN mxpr_tree_species ON mxhvs_tree_species = mxprts_id
    INNER JOIN mxhv_processing_type ON mxhvs_processing_type = mxhvpt_id
    INNER JOIN mxs_session on mxhvs_session = mxsses_id
    INNER JOIN en_entity on mxsses_machine = enen_id
    INNER JOIN mxar_sub_object on mxsses_sub_object = mxarsubobj_id
    INNER JOIN mxar_object ON mxarsubobj_object = mxarobj_id
    WHERE mx_arobj_guid = '${areaUid}'; `

   pg(sqlProduction, function(err, rows, result) {
      if (err) {
         res.send(500, {
            http_status: 500,
            error_msg: err
         })
         return console.error('error running query', err);
      }
      res.send(rows);
      console.log("running query - production");
      return rows;
   });
}


function init_db() {
   pg('CREATE EXTENSION postgis;', createDBSchema);
};

function flush_db() {
   pg('DROP TABLE ' + table_name + ';', function(err, rows, result) {
      var response = 'Database dropped!';
      console.log(response);
      return response;
   });
};

/** test **/
function get_tracks(areaUid, callback) {
   const sqlTracking =
      `SELECT ST_X(locposh_point) AS lon, ST_Y(locposh_point) AS lat, locposh_timestamp AS time, locposh_entity_guid AS guid, locposh_machine_status AS status, locposh_session AS session FROM loc_pos_history
    INNER JOIN mxs_session ON mxsses_id = locposh_session
    INNER JOIN mxar_sub_object ON mxsses_sub_object = mxarsubobj_id
    INNER JOIN mxar_object ON mxarsubobj_object = mxarobj_id
    WHERE mx_arobj_guid = '${areaUid}'
    ORDER BY locposh_id;`

   pg(sqlTracking, function(err, rows, result) {
      if (err) {
         console.error('error running query', err);
         return null;
      }
      callback(rows);
      return rows;
   });
}


module.exports = {
   getAreaDefs: get_area_defs,
   selectBox: select_box,
   getLocationHistory: get_location_history,
   getLocationProduction: get_location_production,
   getTracks: get_tracks,
   flushDB: flush_db,
   initDB: init_db
};