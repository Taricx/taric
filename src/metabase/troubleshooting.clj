(ns metabase.troubleshooting
  (:require
   [clojure.java.jdbc :as jdbc]
   [clojure.java.jmx :as jmx]
   [metabase.analytics.stats :as stats]
   [metabase.config :as config]
   [metabase.db :as mdb]
   [metabase.driver :as driver]
   [toucan.db :as db])
  (:import
   (javax.management ObjectName)))

(set! *warn-on-reflection* true)

(defn system-info
  "System info we ask for for bug reports"
  []
  (into (sorted-map)
        (select-keys (System/getProperties) ["java.runtime.name"
                                             "java.runtime.version"
                                             "java.vendor"
                                             "java.vendor.url"
                                             "java.version"
                                             "java.vm.name"
                                             "java.vm.version"
                                             "os.name"
                                             "os.version"
                                             "user.language"
                                             "user.timezone"
                                             "file.encoding"])))

(defn metabase-info
  "Make it easy for the user to tell us what they're using"
  []
  {:databases                    (->> (db/select 'Database) (map :engine) distinct)
   :hosting-env                  (stats/environment-type)
   :application-database         (mdb/db-type)
   :application-database-details (jdbc/with-db-metadata [metadata (db/connection)]
                                   {:database    {:name    (.getDatabaseProductName metadata)
                                                  :version (.getDatabaseProductVersion metadata)}
                                    :jdbc-driver {:name    (.getDriverName metadata)
                                                  :version (.getDriverVersion metadata)}})
   :run-mode                     (config/config-kw :mb-run-mode)
   :version                      config/mb-version-info
   :settings                     {:report-timezone (driver/report-timezone)}})

(defn- conn-pool-bean-diag-info [acc ^ObjectName jmx-bean]
  (let [bean-id   (.getCanonicalName jmx-bean)
        props     [:numConnections :numIdleConnections :numBusyConnections :minPoolSize :maxPoolSize]]
      (assoc acc (jmx/read bean-id :dataSourceName) (jmx/read bean-id props))))

(defn connection-pool-info
  "Builds a map of info about the current c3p0 connection pools managed by this Metabase instance."
  []
  (->> (reduce conn-pool-bean-diag-info {} (jmx/mbean-names "com.mchange.v2.c3p0:type=PooledDataSource,*"))
       (assoc {} :connection-pools)))
