/*
 * República Digital – versão Java 11+
 * 100 % console-ready, persistência JSON e exportação PDF.
 * Compile:  javac RepublicaDigital.java
 * Rode:     java  RepublicaDigital
 */
import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.*;

public class RepublicaDigital {

    /* ===== ENUMS ===== */
    enum Ideology { ESQUERDA, CENTRO, DIREITA }
    enum GameState { SETUP, CAMPAIGN, GOVERNMENT, ENDED }

    /* ===== DATA MODELS ===== */
    /** Estatísticas numéricas (0-100 onde aplicável) */
    static class Stats implements Serializable {
        int days = 90, funds = 50, support = 0, approval = 45,
            coalitions = 2, media = 30, debate = 0,
            months = 48, economy = 50, social = 50, security = 50,
            international = 50, environment = 50, democracy = 75,
            popularity = 60, impeachmentRisk = 15;

        /* Atualiza valores garantindo faixa 0-100 */
        void add(String field, int value) {
            try {
                var f = Stats.class.getDeclaredField(field);
                int v = f.getInt(this) + value;
                if (!field.equals("funds") && !field.equals("days") && !field.equals("months"))
                    v = Math.max(0, Math.min(100, v));
                f.setInt(this, v);
            } catch (Exception ignored) {}
        }
    }

    static class Player implements Serializable {
        String name;
        Ideology ideology;
        int term = 1, maxTerms = 2;
        Stats stats = new Stats();
        long startTime = System.currentTimeMillis();
    }

    /** Escolha dentro de um evento */
    static class Choice implements Serializable {
        String text;
        Map<String,Integer> effects = new HashMap<>();
        Choice(String t, Map<String,Integer> e){ text=t; effects=e; }
    }

    static class Event implements Serializable {
        String title, description;
        List<Choice> choices = new ArrayList<>();
        Event(String t, String d){ title=t; description=d; }
        Event addChoice(String txt, Map<String,Integer> eff){
            choices.add(new Choice(txt, eff)); return this;
        }
    }

    /* ===== ENGINE ===== */
    static class AIEngine implements Serializable {
        double difficulty = 1.0;
        int aggressive, conservative, populist;

        void registerAction(String type){
            switch(type){
                case "aggressive"   -> aggressive++;
                case "conservative" -> conservative++;
                default             -> populist++;
            }
        }
        /** Gera evento adaptado ao padrão atual */
        Event generateEvent(){
            String dominant = Stream.of(
                    Map.entry("agressive",aggressive),
                    Map.entry("conservative",conservative),
                    Map.entry("populist",populist)
            ).max(Comparator.comparingInt(Map.Entry::getValue)).get().getKey();

            return switch(dominant){
                case "agressive"   -> new Event("Reação Internacional",
                        "Suas políticas agressivas geram tensão diplomática.")
                        .addChoice("Manter posição", Map.of("international",-10,"popularity",5))
                        .addChoice("Buscar diálogo", Map.of("international",5,"popularity",-3));
                case "conservative"-> new Event("Pressão por Mudanças",
                        "Movimentos sociais exigem reformas mais ousadas.")
                        .addChoice("Acelerar reformas", Map.of("social",10,"economy",-5))
                        .addChoice("Manter gradualismo", Map.of("social",-5,"democracy",5));
                default            -> new Event("Questões Fiscais",
                        "Alertas sobre gastos excessivos.")
                        .addChoice("Cortar gastos", Map.of("economy",10,"popularity",-15))
                        .addChoice("Manter programas", Map.of("economy",-8,"popularity",8));
            };
        }
    }

    /* ===== SERVICES ===== */
    static class SaveService {
        private static final Path FILE = Paths.get(System.getProperty("user.home"), ".rep_dig_save.json");
        static void save(Player p, AIEngine ai, GameState state){
            try{
                String json = new com.fasterxml.jackson.databind.ObjectMapper()
                        .writerWithDefaultPrettyPrinter()
                        .writeValueAsString(Map.of("player",p,"ai",ai,"state",state));
                Files.writeString(FILE, json);
            }catch(Exception ignored){}
        }
        static Optional<Object[]> load(){
            try{
                if(!Files.exists(FILE)) return Optional.empty();
                var map = new com.fasterxml.jackson.databind.ObjectMapper()
                        .readValue(Files.readString(FILE), Map.class);
                Player p = new com.fasterxml.jackson.databind.ObjectMapper()
                        .convertValue(map.get("player"), Player.class);
                AIEngine ai = new com.fasterxml.jackson.databind.ObjectMapper()
                        .convertValue(map.get("ai"), AIEngine.class);
                GameState st = GameState.valueOf(map.get("state").toString());
                return Optional.of(new Object[]{p,ai,st});
            }catch(Exception e){ return Optional.empty(); }
        }
    }

    static class ReportService {
        static void exportPDF(Player p){
            try{
                var doc = new com.lowagie.text.Document();
                com.lowagie.text.pdf.PdfWriter.getInstance(doc,
                        new FileOutputStream("Relatorio_"+p.name.replace(" ","_")+".pdf"));
                doc.open();
                doc.addTitle("Relatório República Digital");
                doc.add(new com.lowagie.text.Paragraph("REPÚBLICA DIGITAL\n", 
                        com.lowagie.text.FontFactory.getFont("Helvetica",18)));
                doc.add(new com.lowagie.text.Paragraph(
                  "Candidato: "+p.name+"\nIdeologia: "+p.ideology+"\nMandatos: "+p.term));
                doc.add(new com.lowagie.text.Paragraph("\nEstatísticas:"));
                for(var f: Stats.class.getDeclaredFields()){
                    f.setAccessible(true);
                    doc.add(new com.lowagie.text.Paragraph(
                        f.getName()+": "+f.get(p.stats)));
                }
                doc.close();
                System.out.println("PDF gerado com sucesso.");
            }catch(Exception e){
                System.out.println("Falha ao gerar PDF (OpenPDF não encontrado).");
            }
        }
    }

    /* ===== SIMPLE CLI UI ===== */
    static class ConsoleUI {
        private final Scanner sc = new Scanner(System.in);
        private final Player player;
        private final AIEngine ai;
        private GameState state;

        ConsoleUI(Player p, AIEngine ai, GameState st){ this.player=p; this.ai=ai; this.state=st; }

        void loop(){
            while(state!=GameState.ENDED){
                switch(state){
                    case SETUP -> setup();
                    case CAMPAIGN -> campaignTurn();
                    case GOVERNMENT -> governmentTurn();
                }
            }
        }

        private void setup(){
            System.out.print("Nome do candidato: ");
            player.name = sc.nextLine();
            System.out.print("Ideologia (E/C/D): ");
            switch(sc.nextLine().trim().toUpperCase()){
                case "E" -> player.ideology = Ideology.ESQUERDA;
                case "C" -> player.ideology = Ideology.CENTRO;
                default  -> player.ideology = Ideology.DIREITA;
            }
            state = GameState.CAMPAIGN;
        }

        private void campaignTurn(){
            System.out.printf("\nDias restantes: %d | Fundos: %dM | Apoio: %d%%\n",
                    player.stats.days, player.stats.funds, player.stats.support);
            System.out.println("1-Mídia Social  2-TV  3-Comício  4-Debate  9-Avançar  0-Salvar");
            int op = sc.nextInt(); sc.nextLine();
            switch(op){
                case 1 -> applyAction("populist", Map.of("funds",-8,"days",-5,"support",12,"media",15,"approval",8));
                case 2 -> applyAction("conservative", Map.of("funds",-15,"days",-7,"approval",20,"media",25,"support",8));
                case 3 -> applyAction("populist", Map.of("funds",-5,"days",-10,"support",25,"coalitions",1,"approval",15));
                case 4 -> applyAction("conservative", Map.of("funds",-10,"days",-8,"debate",30,"approval",12,"media",10));
                case 0 -> { SaveService.save(player,ai,state); return; }
                default -> player.stats.days--;
            }
            if(player.stats.days<=0) state = GameState.GOVERNMENT;
        }

        private void applyAction(String type, Map<String,Integer> eff){
            ai.registerAction(type);
            eff.forEach(player.stats::add);
            ai.difficulty += 0.01;
            Event ev = ai.generateEvent();
            if(Math.random()<0.3) handleEvent(ev);
        }
        private void handleEvent(Event ev){
            System.out.println("\n*** "+ev.title+" ***");
            System.out.println(ev.description);
            for(int i=0;i<ev.choices.size();i++)
                System.out.printf("%d-%s\n",i+1,ev.choices.get(i).text);
            int ch=sc.nextInt();sc.nextLine();
            var eff = ev.choices.get(Math.max(1,Math.min(ch,ev.choices.size()))-1).effects;
            eff.forEach(player.stats::add);
        }

        private void governmentTurn(){
            System.out.printf("\nMeses p/ fim do mandato: %d | Popularidade: %d%%\n",
                    player.stats.months, player.stats.popularity);
            System.out.println("1-Reforma Trib. 2-Renda Univ. 3-Segurança 4-Ambiental 9-Avançar 0-PDF");
            int op = sc.nextInt();sc.nextLine();
            switch(op){
                case 1 -> applyGov(Map.of("months",-6,"economy",15,"social",-5,"democracy",-3));
                case 2 -> applyGov(Map.of("months",-8,"social",25,"economy",-10,"democracy",5));
                case 3 -> applyGov(Map.of("months",-4,"security",20,"democracy",-8,"social",-5));
                case 4 -> applyGov(Map.of("months",-10,"environment",30,"economy",-8,"international",15));
                case 0 -> ReportService.exportPDF(player);
                default -> player.stats.months--;
            }
            calcPopularity();
            if(player.stats.months<=0) state=GameState.ENDED;
        }
        private void applyGov(Map<String,Integer> eff){ eff.forEach(player.stats::add); }

        private void calcPopularity(){
            int avg=(player.stats.economy+player.stats.social+player.stats.security+
                    player.stats.environment)/4;
            player.stats.popularity = (int)(avg*0.6 + player.stats.popularity*0.4);
        }
    }

    /* ===== MAIN ===== */
    public static void main(String[] args) {
        // Tenta carregar jogo salvo
        var load = SaveService.load();
        Player player; AIEngine ai; GameState state;
        if(load.isPresent()){
            player=(Player)load.get()[0];
            ai=(AIEngine)load.get()[1];
            state=(GameState)load.get()[2];
            System.out.println("Jogo salvo carregado!\n");
        }else{
            player=new Player();
            ai=new AIEngine();
            state=GameState.SETUP;
        }
        new ConsoleUI(player,ai,state).loop();
        ReportService.exportPDF(player); // exporta ao sair
    }
}
